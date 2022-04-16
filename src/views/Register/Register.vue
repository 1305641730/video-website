<template>
  <div class="register-container">
    <div class="register-bg"></div>
    <el-form :model="registerForm" status-icon :show-message="true" :rules="rules" ref="registerForm" class="register-form">
      <el-form-item>
        <span class="register-label">用户注册</span>
        <span class="is-exist" v-show="isExist">用户名已存在</span>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="registerForm.username" autocomplete="off" placeholder="请输入注册用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model.trim="registerForm.password" autocomplete="off" placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input type="password" v-model.trim="registerForm.repassword" autocomplete="off" placeholder="确认密码">
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-col :span="15">
          <el-input v-model.trim="registerForm.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button type="primary" :disabled="isBtnSend" @click="sendEmailCode">{{ btnSendInfo }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model.trim="registerForm.code" autocomplete="off" placeholder="请输入验证码">
        </el-input>
      </el-form-item>
      <el-form-item class="btn-box">
        <el-button type="primary" @click="register('registerForm')" class="register-btn">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isExist, registerUser, sendCode } from '@/api/user.js'

export default {
  name: 'register-vue',
  data() {
    const validateRePass = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const pattern = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,})$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!pattern.test(value)) {
        callback(new Error('请输入正确的邮箱格式!'))
      } else {
        callback()
      }
    }
    return {
      isExist: false,
      isBtnSend: false,
      btnSendInfo: '获取验证码',
      registerForm: {
        username: '',
        password: '',
        repassword: '',
        email: '',
        code: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        repassword: [{ validator: validateRePass, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        code: [{ required: true, message: '请输入收到的验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 注册发送验证码
    async sendEmailCode() {
      console.log(this.registerForm)
      if (!this.isExist && this.registerForm.email !== '' && this.registerForm.username !== '') {
        // 倒计时30秒之后才能再次发送验证码
        let count = 30
        this.isBtnSend = true
        const timer = setInterval(() => {
          count--
          if (count === 0) {
            clearInterval(timer)
            this.isBtnSend = false
            this.btnSendInfo = '获取验证码'
          } else {
            this.btnSendInfo = `${count}秒后重试`
          }
        }, 1000)
        const { data: res } = await sendCode(this.registerForm.username, this.registerForm.email)
        console.log(res)
        // if (res.flag && res.data) {
        //   this.$message.success(res.msg)
        // } else {
        //   this.$message.error(res.msg)
        // }
      } else {
        if (this.isExist) {
          this.$message.error('该用户名已被使用，请更换用户名!')
        } else {
          this.$message.error('请输入邮箱地址和用户名!')
        }
      }
    },
    register(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid && !this.isExist) {
          // 注册业务
          const { data: res } = await registerUser({
            username: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email,
            code: this.registerForm.code
          })
          if (res.flag && res.data) {
            this.isExist = res.data
            this.$message.success(res.msg)
            this.$refs.registerForm.resetFields()
            this.$router.push('/login')
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    }
  },
  watch: {
    async 'registerForm.username'(newVal) {
      const { data: res } = await isExist({
        username: this.registerForm.username
      })
      this.isExist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.register-container {
  position: relative;
  .register-bg {
    position: fixed;
    left: 0;
    background: url('@/assets/login-background.png') no-repeat fixed left top/100% 100%;
    width: 100%;
    height: 100%;
  }
  .register-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 30px 30px 15px;
    background-color: white;
    margin: 100px 0;
    width: 430px;
    position: absolute;
    left: 50%;
    margin-left: -215px;
    .register-label {
      font-size: 22px;
    }
    .btn-box {
      button {
        width: 320px;
      }
    }
    .is-exist {
      position: absolute;
      right: 60px;
      top: 30px;
      color: red;
    }
    /deep/ .el-form-item__error {
      margin-left: 60px;
    }
    /deep/ .el-input-group__append {
      padding: 0 10px;
    }
  }
}
</style>
