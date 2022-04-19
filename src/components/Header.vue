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
          <el-input v-model="search" placeholder="请输入要搜索的内容" :rows="4" v-show="isShowSearch" @keyup.enter.native="searchContent">
            <el-button slot="append" icon="el-icon-search" @click="searchContent"></el-button>
          </el-input>
        </div>
      </el-col>
      <!-- 用户头像 -->
      <el-col :span="4">
        <el-menu-item index="1" @click="toPersonal">
          <el-popover placement="bottom" trigger="hover" v-model="isVisible">
            <el-card class="box-card">
              <div class="item">
                <router-link to="/personal"><i class="el-icon-user-solid"></i><span>个人中心</span></router-link>
              </div>
              <div class="item" @click="toSystemInfo"><i class="el-icon-message"></i><span>系统消息</span></div>
              <div class="item" @click="toReplyToMe"><i class="el-icon-chat-dot-round"></i><span>回复我的</span></div>
            </el-card>
            <el-avatar slot="reference" :src="avatarUrl"></el-avatar>
          </el-popover>
        </el-menu-item>
      </el-col>
      <!-- 用户登录注册 -->
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
  props: {
    avatarUrl: null,
    isShowSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: '',
      // 是否显示头像下面列表
      isVisible: false
    }
  },
  methods: {
    loginOut() {
      this.$emit('loginOut')
    },
    toPersonal() {
      this.$emit('toPersonal')
    },
    searchContent() {
      this.$emit('searchContent', this.search)
    },
    toSystemInfo() {
      this.$emit('toSystemInfo')
    },
    toReplyToMe() {
      this.$emit('toReplyToMe')
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
.box-card {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: space-around;
  /deep/ .el-card__body {
    width: 100%;
    .item {
      cursor: pointer;
      width: 100%;
      margin: 0 10px;
      font-size: 14px;
      padding: 5px 0;
      text-align: center;
      span {
        margin-left: 5px;
      }
    }
  }
  .item:hover {
    background-color: #f1f1f1;
  }
}
</style>
