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

    <!-- tab便签页 -->
    <div class="personal_content">
      <el-tabs class="personal_tabs" v-model="activeName" @tab-click="handleClick">
        <!-- 我的视频 -->
        <el-tab-pane label="我的视频" name="first">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">最新发布</el-menu-item>
            <el-menu-item index="2">最多播放</el-menu-item>
          </el-menu>

          <VideoList :videos="videos" :total="pageInfo.total" :isDelete="true" @handleDelete="deleteVideo" @handleCurrentChange="myVideoPageChange"></VideoList>
          <!-- 个人投稿视频数为0时显示 -->
          <el-empty class="personal-video-mask" v-if="videos === null || videos.length === 0" description="还没有投稿视频喔">
            <router-link to="/upload">立即投稿</router-link>
          </el-empty>
        </el-tab-pane>

        <!-- 收藏 -->
        <el-tab-pane label="收藏" name="second">
          <VideoList :videos="collections" :isCollection="true" :total="pageInfo.total" @handleCollection="cancelCollection" @handleCurrentChange="myCollectionPageChange"></VideoList>
          <el-empty v-if="!collections || collections.length === 0" description="暂无收藏视频"></el-empty>
        </el-tab-pane>

        <!-- 个人资料 -->
        <el-tab-pane label="个人资料" name="third">
          <el-card class="personal-file-card">
            <el-form status-icon :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-userForm">
              <el-form-item label="头像">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleUploadAvatar">
                  <div class="avatar-div">
                    <el-avatar :size="60" key="cover" :src="userForm.avatar" @error="errorHandler">
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
                <el-button type="primary" @click="savePersonalFile('userForm')">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>

        <!-- 密码修改 -->
        <el-tab-pane label="修改密码" name="fourth">
          <el-card class="pwdupdate-card">
            <el-form :model="pwdForm" status-icon :rules="rules" ref="pwdForm" label-width="100px" class="demo-pwdForm">
              <el-form-item label="邮箱" prop="email">
                <el-input disabled v-model="pwdForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-col :span="16">
                  <el-input type="number" v-model="pwdForm.code" autocomplete="off"></el-input>
                </el-col>
                <el-col :span="4" :offset="2">
                  <el-button :disabled="isDisabled" type="primary" @click="getCode">{{ btnSendCodeTxt }}</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="pwdForm.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="repassword">
                <el-input type="password" v-model="pwdForm.repassword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="savePwdUpdate('pwdForm')">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>

        </el-tab-pane>

        <el-input v-show="isShowSearch" v-model="searchKeyWord" placeholder="搜索视频" class="personal_search"></el-input>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getUserById, updateUser, uploadAvatar, sendCode, updatePwd } from '@/api/user.js'
import { getVideosById, deleteVideo, getVideosByUserAndTitle, getCollectionVideos } from '@/api/video.js'
import { deleteCollection } from '@/api/collection.js'
import { mapMutations } from 'vuex'
import VideoList from '@/components/VideoList.vue'

export default {
  name: 'personal-vue',
  components: {
    VideoList
  },
  data() {
    const validateRePass = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
      activeName: 'first',
      // 我的视频页数据
      isShowSearch: true,
      videos: null,
      collections: null,
      activeIndex: '1',
      searchKeyWord: '',
      pageInfo: {
        pageNum: 1,
        pageSize: 12,
        total: 0
      },
      // 个人资料表单数据
      userForm: {
        username: '',
        avatar: this.$store.state.avatar ? this.$store.state.avatar : require('@/assets/noface.gif'),
        sex: 0
      },
      // 密码修改表单数据
      btnSendCodeTxt: '获取验证码',
      isDisabled: false,
      pwdForm: {
        email: '',
        code: null,
        password: null,
        repassword: null
      },
      rules: {
        username: [
          { required: true, message: '请输入要修改的昵称', trigger: 'blur' },
          { min: 3, max: 16, message: '数字、字母、汉字、符号加起来不能超过16个', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 16, message: '数字、字母、汉字、符号加起来不能超过16个', trigger: 'blur' }
        ],
        repassword: [
          { validator: validateRePass, trigger: 'blur' },
          { min: 3, max: 16, message: '数字、字母、汉字、符号加起来不能超过16个', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setAvatar', 'setUserName']),
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
        // 初始化密码修改表单数据
        this.pwdForm.email = this.user.email
      })
    },
    handleClick(tab, event) {
      console.log(tab)
      if (tab.index === '0') {
        this.isShowSearch = true
      } else {
        this.isShowSearch = false
      }
    },
    async updateIntro() {
      const user = {
        id: this.user.id,
        intro: this.user.intro
      }
      const { data: res } = await updateUser(user)
      console.log(res)
    },
    // 获取个人投稿视频
    async fetchVideos() {
      const { data: res } = await getVideosById(this.$store.state.userId, this.pageInfo.pageNum, this.pageInfo.pageSize)
      console.log(res)
      if (res.flag && res.data) {
        this.videos = res.data.list
        this.total = res.data.total
      }
    },
    // 处理个人视频分页点击事件
    myVideoPageChange(currentPage) {
      this.pageInfo.pageNum = currentPage
      this.fetchVideos()
    },
    // 处理我的视频下导航菜单选择事件
    handleSelect(key, keyPath) {
      console.log(keyPath)
      if (key === '1') {
        this.fetchVideos()
      } else {
        this.videos = this.videos.sort((a, b) => b.views - a.views)
      }
    },
    // 获取用户收藏视频
    async fetchUserCollections() {
      const { data: res } = await getCollectionVideos(this.$store.state.userId, this.pageInfo.pageNum, this.pageInfo.pageSize)
      this.collections = res.data.list
      if (res.flag && res.data) {
        this.collections = res.data.list
        this.total = res.data.total
      }
      console.log(this.collections)
    },
    // 处理用户收藏分页点击事件
    myCollectionPageChange(currentPage) {
      this.pageInfo.pageNum = currentPage
      this.fetchUserCollections()
    },
    // 取消收藏
    async cancelCollection(userId, videoId, title) {
      if (confirm('您确定要取消对 ' + title + ' 视频的收藏吗')) {
        const { data: res } = await deleteCollection(userId, videoId)
        console.log(res)
        if (res.flag && res.data) {
          this.$message.success(res.msg)
          this.fetchUserCollections()
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    // 删除个人投稿视频
    async deleteVideo(id, title) {
      if (confirm('您确定要删除' + title + '吗')) {
        const { data: res } = await deleteVideo(id)
        if (res.flag && res.data) {
          this.$message.success(res.msg)
          this.fetchVideos()
          this.fetchUserCollections()
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    // 图片加载失败
    errorHandler() {
      this.userForm.avatar = require('@/assets/noface.gif')
      return true
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
        console.log(this.userForm.avatar)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 提交个人资料表单数据
    savePersonalFile(formName) {
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
            // 更新成功修改vuex中的数据
            this.setAvatar(res.data.avatar)
            this.setUserName(this.userForm.username)
            this.fetchUser()
          } else {
            this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    // 获取验证码
    async getCode() {
      let count = 30
      this.isDisabled = true
      const timer = setInterval(() => {
        count--
        if (count === 0) {
          clearInterval(timer)
          this.isDisabled = false
          this.btnSendCodeTxt = '获取验证码'
        } else {
          this.btnSendCodeTxt = `${count}秒后重试`
        }
      }, 1000)

      const { data: res } = await sendCode(this.$store.state.userName, this.pwdForm.email)
      console.log(res)
    },
    // 提交密码修改表单数据
    savePwdUpdate(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.pwdForm.id = this.$store.state.userId
          this.pwdForm.username = this.$store.state.userName
          const { data: res } = await updatePwd(this.pwdForm)
          console.log(res)
          if (res.flag && res.data) {
            this.$message.success(res.msg)
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
  created() {
    this.fetchUser()
    this.fetchVideos()
    this.fetchUserCollections()
  },
  watch: {
    // 监听搜索视频框关键字
    async searchKeyWord(newVal) {
      if (newVal !== '') {
        const { data: res } = await getVideosByUserAndTitle(this.$store.state.userId, this.searchKeyWord)
        console.log(res)
        if (res.flag && res.data.length !== 0) {
          this.videos = res.data
        }
      } else {
        this.fetchVideos()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.persional-container {
  // 修改elementui头像样式
  /deep/ .el-avatar {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .el-menu {
    margin-bottom: 10px;
  }
  .el-menu-item {
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 12px;
  }
  .el-menu-item:not(:first-child) {
    margin-left: 10px;
  }
  .personal_search {
    position: absolute;
    left: 200px;
    top: 0px;
    width: 150px;
    /deep/ input {
      height: 30px;
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
  .personal-file-card,
  .pwdupdate-card {
    width: 600px;
    margin: 0 auto;
    .el-form {
      margin-right: 30px;
      .el-form-item:last-child {
        margin-bottom: 0;
      }
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
  .personal-video-mask {
    a {
      color: #00a1d6;
    }
  }
}
</style>
