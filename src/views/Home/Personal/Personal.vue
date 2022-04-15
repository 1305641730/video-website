<template>
  <div class="persional-container">
    <!-- 顶部用户头像信息 -->
    <div class="personal_top" :style="'background-image: url(' + bg + ');'">
      <div class="user_div">
        <el-avatar :size="60" :src="user.avatar"></el-avatar>
        <div class="user_info">
          <p class="user_name">{{ user.username }}
            <span class="user_sex">
              <i class="male el-icon-male" v-if="user.sex === 0"></i>
              <i class="female el-icon-female" v-else></i>
            </span>
          </p>
          <div>
            <input class="user_intro" placeholder="编辑个性签名" maxlength="60" v-model="user.intro" @blur="updateIntro" />
          </div>
        </div>
      </div>
    </div>
    <div class="personal_content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>

        <!-- 个人资料 -->
        <el-tab-pane label="个人资料" name="third">
          <el-card class="personal-file-card">
            <el-form status-icon :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-userForm">
              <el-form-item label="头像">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleUploadAvatar">
                  <div class="avatar-div">
                    <el-avatar :size="60" key="cover" :src="userForm.avatar">
                    </el-avatar>
                    <div class="avatar-mask">更换头像</div>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="昵称" prop="username">
                <el-input v-model="userForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio v-model="userForm.sex" :label="0">男</el-radio>
                <el-radio v-model="userForm.sex" :label="1">女</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getUserById, updateUser, uploadAvatar } from '@/api/user.js'
import { mapMutations } from 'vuex'

export default {
  name: 'personal-vue',
  data() {
    return {
      bg: require('@/assets/bg.jpg'),
      user: {
        // 顶部
        username: '',
        avatar: null,
        intro: '',
        sex: 0
      },
      // tab便签页
      activeName: 'third',
      // 个人资料数据
      userForm: {
        username: '',
        avatar: '',
        sex: 0
      },
      rules: {
        username: [
          { required: true, message: '请输入要修改的昵称', trigger: 'blur' },
          { min: 3, max: 16, message: '数字、字母、汉字、符号加起来不能超过16个', trigger: 'blue' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setAvatar']),
    async fetchUser() {
      if (!this.$store.state.userId) return
      const { data: res } = await getUserById(this.$store.state.userId)
      this.$nextTick(() => {
        this.user = res.data
        console.log(res)
        this.user.sex = this.user.sex ? this.user.sex : 0
        this.user.avatar = this.user.avatar ? this.user.avatar : require('@/assets/noface.gif')
        // 初始化个人资料中数据
        this.userForm.username = this.user.username
        this.userForm.avatar = this.user.avatar
        this.userForm.sex = this.user.sex
        this.setAvatar(this.user.avatar)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async updateIntro() {
      const user = {
        id: this.user.id,
        intro: this.user.intro
      }
      const { data: res } = await updateUser(user)
      console.log(res)
    },
    // 个人资料表单事件
    async handleUploadAvatar({ file }) {
      const isImage = ['png', 'jpeg', 'jpg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      const form = new FormData()
      const arr = file.name.split('.')
      const suffix = arr[arr.length - 1]
      if (isImage.indexOf(suffix) === -1) {
        return this.$message.error('文件格式错误')
      }
      form.append('file', file)

      const { data: res } = await uploadAvatar(form)
      console.log(res)
      if (res.flag && res.data) {
        this.$message.success(res.msg)
        this.userForm.avatar = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // 个人资料表单校验成功
        if (valid) {
          const user = {
            id: this.$store.state.userId,
            username: this.userForm.username,
            sex: this.userForm.sex,
            avatar: this.userForm.avatar
          }
          const { data: res } = await updateUser(user)
          if (res.flag && res.data) {
            this.$message.success(res.msg)
            this.fetchUser()
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.fetchUser()
  }
}
</script>

<style lang="less" scoped>
.persional-container {
  margin: 0 5rem;
  // 修改elementui头像样式
  /deep/ .el-avatar {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .personal_top {
    position: relative;
    height: 200px;
    background-position: 50%;
    background-size: cover;
  }
  .user_div {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    left: 30px;
    bottom: 20px;
    .user_info {
      margin-left: 20px;
      color: white;
      vertical-align: baseline;
      .user_name {
        font-weight: 700;
        line-height: 20px;
        font-size: 20px;
        font-family: Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      }
      .user_sex {
        .male {
          color: skyblue;
        }
        .female {
          color: pink;
        }
      }
    }
    .user_intro {
      display: inline-block;
      margin-top: 8px;
      background: transparent;
      border-radius: 4px;
      border: none;
      box-shadow: none;
      color: #757575;
      font-size: 12px;
      font-family: Microsoft Yahei;
      line-height: 26px;
      height: 26px;
      margin-left: -5px;
      padding: 0 5px;
      position: relative;
      top: -1px;
      width: 730px;
    }
    .user_intro:focus {
      border: none;
      background: white;
      box-shadow: inset 0 2px 4px rgb(35 54 86 / 30%);
      color: #6d757a;
    }
  }
  .personal-file-card {
    width: 600px;
    margin: 0 auto;
    .el-form {
      margin-right: 30px;
      .avatar-div {
        position: relative;
      }
      .avatar-mask {
        position: absolute;
        text-align: center;
        line-height: 60px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .avatar-div:hover .avatar-mask {
        opacity: 0.8;
      }
    }
  }
}
</style>
