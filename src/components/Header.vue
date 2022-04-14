<template>
  <el-row>
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64">
      <el-col :span="4">
        <el-menu-item index="1" @click="$router.push('/')">
          <router-link to="/">主页</router-link>
        </el-menu-item>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="8" :offset="4">
        <div class="search-box">
          <el-input v-model="search" placeholder="请输入要搜索的内容" :rows="4"></el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <el-menu-item index="1" @click="toPersonal">
          <el-avatar :src="avatarUrl"></el-avatar>
        </el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="1">
          <div v-if="!this.$store.state.userId">
            <router-link to="/login">登录</router-link>
            <span>/</span>
            <router-link to="/register">注册</router-link>
          </div>
          <div v-else>
            <span @click="loginOut">退出登录</span>
          </div>
        </el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="1">
          <el-button type="danger" icon="el-icon-upload" class="upload" @click="$router.push('/upload')">
            <span>投稿</span>
          </el-button>
        </el-menu-item>
      </el-col>
    </el-menu>
  </el-row>
</template>

<script>
export default {
  name: 'headear-vue',
  props: ['avatarUrl'],
  data() {
    return {
      search: ''
    }
  },
  methods: {
    loginOut() {
      this.$emit('loginOut')
    },
    toPersonal() {
      this.$emit('toPersonal')
    }
  }
}
</script>

<style lang='less' scoped>
.el-menu-demo {
  box-sizing: border-box;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%);
  color: white;
  align-items: v;
}
.el-menu-item {
  line-height: 50px;
  height: 50px;
  text-align: center;
  .is-active {
    border-bottom: 0;
  }
  /deep/ i,
  /deep/ span {
    color: white;
  }
  a:hover {
    color: rgb(107, 166, 253);
  }
  a,
  span {
    color: white;
  }
  /deep/ .el-avatar {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.search-box {
  width: 300px;
  line-height: 50px;
  height: 50px;
  text-align: center;
}
</style>
