<template>
  <div class="live-container">
    <div class="bg"></div>
    <div class="live-box">
      <div class="live-left">
        <div class="live-left-top">
          <el-avatar :size="60" :src="avatar"></el-avatar>
          <div class="live-info">
            <div class="livename">直播间</div>
            <div class="username">admin</div>
          </div>
        </div>
        <div id="dplayer" ref="dplayer"></div>
      </div>
      <div class="live-right">
        <div class="danmu-title">弹幕列表</div>
        <div class="danmu-talk-box"></div>
        <div>
          <el-input type="textarea" placeholder="请输入内容" v-model="danmuTextArea" maxlength="20" show-word-limit>
          </el-input>
          <el-button type="primary">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DPlayer from 'dplayer'
import { getLiveById } from '@/api/live.js'

export default {
  name: 'live-vue',
  props: ['id'],
  data() {
    return {
      avatar: '',
      player: null,
      dp: null,
      danmuTextArea: '',
      live: null
    }
  },
  methods: {
    setVideoUrl(url) {
      this.player.switchVideo({
        url: url
      })
    },
    async fetchLiveInfo() {
      const { data: res } = await getLiveById(this.id)
      console.log(res)
      if (res.flag && res.data) {
        this.live = res.data
        this.dp = new DPlayer({
          container: this.$refs.dplayer,
          live: true,
          autoplay: true,
          preload: 'auto',
          // danmaku: true,
          // apiBackend: {
          //   read: function(endpoint, callback) {
          //     console.log('Pretend to connect WebSocket')
          //     callback()
          //   },
          //   send: function(endpoint, danmakuData, callback) {
          //     console.log('Pretend to send danmaku via WebSocket', danmakuData)
          //     callback()
          //   }
          // },
          video: {
            url: res.data.streamAddr2,
            type: 'flv'
          }
        })
      }
    }
  },
  mounted() {
    this.fetchLiveInfo()
    this.dplayer = this.$refs.dplayer.dp
  }
}
</script>

<style lang="less" scoped>
.live-container {
  .bg {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: url('@/assets/live-bg.jpg') center/cover no-repeat fixed;
    -webkit-background-size: cover;
    opacity: 0.8;
  }
  .live-box {
    position: fixed;
    left: 50%;
    margin-top: 15px;
    min-height: 800px;
    padding-bottom: 75px;
    margin-left: -750px;
    display: flex;
    flex-direction: row;
    .live-left {
      margin-right: 15px;
      width: 1185px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      padding: 20px 20px 0;
      .live-left-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
        .live-info {
          margin-left: 10px;
        }
        .livename {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 24px;
          line-height: 24px;
          font-weight: 700;
        }
        .username {
          margin-top: 12px;
          font-size: 14px;
          color: #999;
          transition: color 0.5s;
          line-height: 16px;
          max-width: 85px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      #dplayer {
        flex: 1;
        margin-bottom: 10px;
      }
    }
    .live-right {
      width: 350px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 10px;
      padding-bottom: 10px;
      .danmu-title {
        margin: 10px 10px;
      }
      .danmu-talk-box {
        background-color: #f8f8f8;
        flex-grow: 1;
      }
      .el-textarea {
        width: 330px;
        margin: 0 10px;
      }
      .el-button {
        margin-top: 5px;
        margin-left: 260px;
      }
    }
  }
}
</style>
