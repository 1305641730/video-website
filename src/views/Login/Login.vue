<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <el-form :model="loginForm" status-icon ref="ruleForm" class="login-form" @keyup.enter.native="submitForm">
      <el-form-item>
        <span class="login-label">用户登录</span>
      </el-form-item>
      <el-form-item>
        <el-input type="username" v-model.trim="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model.trim="loginForm.password" autocomplete="off" placeholder="请输入密码">
          <template slot="append">
            <a class="forget-pass">忘记密码?</a>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="btn-box">
        <el-button type="primary" @click="$router.push('/register')" class="register-btn">注册</el-button>
        <el-button type="primary" @click="submitForm" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginUser } from '@/api/user.js'
import { mapMutations } from 'vuex'

export default {
  name: 'login-vue',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setUserId', 'setUserName', 'setAvatar']),
    async submitForm() {
      // 登录业务
      const { data: res } = await loginUser(this.loginForm)
      if (res.flag && res.data) {
        console.log(res)
        this.$message.success(res.msg)
        this.setUserId(res.data.id)
        this.setUserName(res.data.username)
        this.setAvatar(res.data.avatar)
        localStorage.setItem('token', res.data.token)
        this.$router.push('/')
      } else {
        this.$message.error(res.msg)
        this.resetForm()
      }
    },
    resetForm() {
      this.loginForm.username = ''
      this.loginForm.password = ''
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  .login-bg {
    position: fixed;
    left: 0;
    background: url('@/assets/login-background.png') no-repeat fixed left top/100% 100%;
    width: 100%;
    height: 100%;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    border-radius: 20px;
    padding: 30px 10px 15px;
    background-color: white;
    margin: 100px 0;
    width: 430px;
    position: absolute;
    left: 50%;
    margin-left: -215px;
    .login-label {
      font-size: 22px;
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
      align-content: center;
      button {
        width: 150px;
      }
      .login-btn {
        margin-left: 20px;
      }
      .register-btn {
        background-color: #fff;
        color: black;
        border-color: black;
      }
    }
    .forget-pass {
      cursor: pointer;
    }
    .forget-pass:hover {
      color: skyblue;
    }
  }
}
.el-input {
  width: 320px;
}
</style>
