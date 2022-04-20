<template>
  <div class="message-container">
    <div class="bg"></div>
    <div class="main-body">
      <div class="message-left">
        <router-link class="item" :to="{name: 'sysinfo'}"><i class="el-icon-message"></i><span>系统消息</span></router-link>
        <router-link class="item" :to="{name: 'reply'}"><i class="el-icon-chat-dot-round"></i><span>回复我的</span></router-link>
      </div>
      <div class="message-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message-vue'
}
</script>

<style lang='less' scoped>
.message-container {
  .bg {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: url('@/assets/message-bg.jpg') center/cover no-repeat fixed;
    -webkit-background-size: cover;
    opacity: 0.8;
  }
  .main-body {
    position: fixed;
    left: 50%;
    top: 50px;
    margin-left: -575px;
    height: 100%;
    z-index: 999;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
  }
  .message-left {
    width: 150px;
    height: 100%;
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    z-index: 999;
    .item {
      margin: 10px 0;
      span {
        margin-left: 5px;
      }
    }
    .item:hover {
      color: #2faee3;
    }
  }
  .message-main {
    width: 1000px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 999;
  }
}
</style>
