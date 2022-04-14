<template>
  <el-container>
    <el-header style="height: 50px;">
      <Header @loginOut="handleLoginOut" @toPersonal="$router.push('/personal')" v-if="isResetHeader" :avatarUrl="avatar" />
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'home-vue',
  components: {
    Header
  },
  data() {
    return {
      isResetHeader: true,
      avatar: this.$store.state.avatar ? this.$store.state.avatar : require('@/assets/noface.gif')
    }
  },
  methods: {
    ...mapMutations(['setUserId']),
    handleLoginOut() {
      this.setUserId(null)
      localStorage.removeItem('token')
      this.refreshHeader()
    },
    refreshHeader() {
      this.isResetHeader = false
      this.$nextTick(() => {
        this.isResetHeader = true
      })
    }
  },
  // 监听vuex中avatar数据变化
  computed: {
    avatarData() {
      return this.$store.state.avatar
    }
  },
  watch: {
    avatarData() {
      this.avatar = this.$store.state.avatar
      this.refreshHeader()
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
}
.el-main {
  padding: 15px;
  padding-top: 0;
}
</style>
