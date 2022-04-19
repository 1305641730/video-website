<template>
  <el-container>
    <el-header style="height: 50px;">
      <Header @loginOut="handleLoginOut" @toPersonal="$router.push('/personal')" @searchContent="handleSearch" @toSystemInfo="toSystemInfo" @toReplyToMe="toReplyToMe" v-if="isResetHeader" :isShowSearch="isShowSearch" :avatarUrl="avatar" />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapMutations } from 'vuex'
import { getUserById } from '@/api/user.js'

export default {
  name: 'home-vue',
  components: {
    Header
  },
  data() {
    return {
      isResetHeader: true,
      isShowSearch: true,
      avatar: this.$store.state.avatar ? this.$store.state.avatar : require('@/assets/noface.gif')
    }
  },
  methods: {
    ...mapMutations(['setUserName', 'setAvatar', 'setUserId']),
    handleLoginOut() {
      this.setUserId(null)
      localStorage.removeItem('token')
      this.refreshHeader()
    },
    async updateVuexUserInfo() {
      const { data: res } = await getUserById(this.$store.state.userId)
      console.log('index.vue user=====', res)
      this.setUserName(res.data.username)
      this.setAvatar(res.data.avatar)
      this.avatar = res.data.avatar
      this.refreshHeader()
    },
    refreshHeader() {
      this.isResetHeader = false
      this.$nextTick(() => {
        this.isResetHeader = true
      })
    },
    handleSearch(content) {
      this.isShowSearch = false
      if (this.search !== '') {
        this.$router.push('/search/' + content)
      }
    },
    // 跳转至 系统消息 界面
    toSystemInfo() {
      // this.$router.push(this.$store.state.userId + '/message/sysinfo')
      this.$router.push(this.$store.state.userId + '/message')
    },
    // 跳转至 回复我的 消息界面
    toReplyToMe() {
      this.$router.push(this.$store.state.userId + '/message/replay')
    }
  },
  computed: {
    userIdData() {
      return this.$store.state.userId
    },
    userNameData() {
      return this.$store.state.username
    },
    userAvatarData() {
      return this.$store.state.avatar
    }
  },
  // 监听vuex中avatar数据变化
  watch: {
    userIdData() {
      this.updateVuexUserInfo()
    },
    userNameData() {
      this.updateVuexUserInfo()
    },
    userAvatarData() {
      this.updateVuexUserInfo()
    },
    $route(to) {
      if (to.name === 'videos') {
        this.isShowSearch = true
        this.refreshHeader()
      } else {
        this.isShowSearch = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
body {
  margin: 0;
  padding: 0;
}
/deep/ .el-menu-demo {
  border-bottom: 0;
}
.el-header {
  padding: 0;
  box-sizing: border-box;
  z-index: 999;
}
.el-main {
  max-width: 2540px;
  min-width: 1080px;
  padding: 0 64px;
  padding-top: 0;
}
.el-popover {
  padding: 0;
}
</style>
