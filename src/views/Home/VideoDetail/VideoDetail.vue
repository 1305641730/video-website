<template>
  <div class="vuedetail-container">
    <div class="video_left">
      <h1 class="video-title">{{ videoDate.title }}</h1>
      <div class="dplayer" ref="dplayer"></div>
      <div class="video-star-co-view">
        <span class="video-sapn" @click.stop="updateStars">
          <el-button circle class="video-btn el-icon-thumb">{{ videoDate.stars }}</el-button>
        </span>
        <span class="video-sapn" @click.stop="updateCollection">
          <el-button v-if="isCollection" circle class="video-btn el-icon-star-on">{{ videoDate.collections }}</el-button>
          <el-button v-else circle class="video-btn el-icon-star-off">{{ videoDate.collections }}</el-button>
        </span>
        <span class="video-sapn">
          <el-button class="video-btn video-btn-views el-icon-view">{{ videoDate.views }}</el-button>
        </span>
      </div>
      <Comment v-if="isCommentShow" ref="comment" :avatar="avatar" :comments="comments" :groupcount="10" @sendComment="handleComment" @sendComment2="handleComment2"></Comment>
    </div>
    <div class="video_right"></div>
  </div>
</template>

<script>
import Dplayer from 'dplayer'
import { getVideoById, addViews, addStars, addCollections } from '@/api/video.js'
import { sendComments, getComments } from '@/api/comment.js'
import { getUserById } from '@/api/user.js'
import Comment from '@/components/Comment.vue'

export default {
  name: 'videodetail-vue',
  props: ['id'],
  data() {
    return {
      // 视频组件数据
      videoId: parseInt(this.id),
      player: null,
      dp: null,
      videoDate: {
        stars: 0,
        collections: 0,
        views: 0
      },
      isCollection: false,
      // 评论组件数据
      avatar: this.$store.state.avatar ? this.$store.state.avatar : require('@/assets/noface.gif'),
      comments: null,
      isCommentShow: true
    }
  },
  components: {
    Comment
  },
  methods: {
    setVideoUrl(url) {
      this.player.switchVideo({
        url: url
      })
    },
    // 更新播放量
    async updateViews() {
      const { data: res } = await addViews({ id: this.id, views: 1 })
      this.videoDate.views++
      console.log(res)
    },
    // 更新点赞数
    async updateStars() {
      const { data: res } = await addStars({ id: this.id, stars: 1 })
      console.log(res)
      if (res.flag && res.data) {
        this.$message.success('点赞成功！')
      }
      this.videoDate.stars++
    },
    // 更新收藏数，并更新收藏数据
    async updateCollection() {
      const video = { id: this.videoId, collections: 1 }
      const collection = { userId: this.$store.state.userId, videoId: this.videoId, collectionDate: new Date() }
      const { data: res } = await addCollections({ video: video, collection: collection })
      this.videoDate.collections++
      if (res.flag && res.data) {
        this.$message.success(res.msg)
      }
    },
    // 获取视频
    async fetchVideo() {
      const { data: res } = await getVideoById(this.id)
      console.log(res)
      this.videoDate = res.data
      this.dp = new Dplayer({
        container: this.$refs.dplayer,
        autoplay: true,
        preload: 'auto',
        video: {
          url: res.data.videoUrl
        }
        // danmaku: {
        //   id: '9E2E3368B56CDBB4',
        //   api: 'https://api.prprpr.me/dplayer/',
        //   token: 'tokendemo',
        //   maximum: 1000,
        //   addition: ['https://api.prprpr.me/dplayer/v3/bilibili?aid=4157142'],
        //   user: 'DIYgod',
        //   bottom: '15%',
        //   unlimited: true
        // }
      })
    },
    // 发送评论
    async handleComment(comment) {
      // 去除评论内容首位空格和换行
      comment = comment.replace(/^\s+|\s+$/g, '')
      const resComment = {
        user: {
          id: this.$store.state.userId
        },
        videoId: this.id,
        content: comment,
        comDate: new Date()
      }
      console.log(resComment)
      const { data: res } = await sendComments(resComment)
      if (res.flag && res.data) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this.$refs.comment.resetComment()
      this.fetchComments()
    },
    // 获取评论
    async fetchComments() {
      const { data: res } = await getComments(this.id)
      console.log(res)
      if (res.flag && res.data.length !== 0 && res.data) {
        this.comments = res.data
        this.fetchComUserName()
      }
    },
    // 获取所有回复评论回复人姓名
    fetchComUserName() {
      this.comments.forEach(async comment => {
        if (comment.comUserId !== null) {
          const { data: res } = await getUserById(comment.comUserId)
          if (res.flag && res.data) {
            comment.comUserName = res.data.username
          }
        }
      })
      // 对评论数据加工为二级
      const data = []
      for (let i = 0; i < this.comments.length; i++) {
        const comment = this.comments[i]
        comment.child = []
        for (let j = 0; j < this.comments.length; j++) {
          const comment2 = this.comments[j]
          if (comment2.commentId === comment.id) {
            comment.child.push(comment2)
          }
        }
        data.push(comment)
      }
      this.comments = data.filter(item => item.commentId === null)
      this.refreshComment()
    },
    // 二级评论回复
    async handleComment2(comment, content) {
      // 去除评论内容首位空格和换行
      content = content.replace(/^\s+|\s+$/g, '')
      const resComment = {
        user: {
          id: this.$store.state.userId
        },
        comUserId: comment.user.id,
        comCommentId: comment.comCommentId,
        commentId: comment.commentId,
        videoId: this.id,
        content: content,
        comDate: new Date()
      }
      console.log(resComment)
      const { data: res } = await sendComments(resComment)
      if (res.flag && res.data) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this.$refs.comment.resetComment2()
      this.fetchComments()
    },
    refreshComment() {
      this.isCommentShow = false
      this.$nextTick(() => {
        this.isCommentShow = true
      })
    }
  },
  created() {
    this.fetchVideo()
    this.updateViews()
    this.fetchComments()
  },
  mounted() {
    this.player = this.$refs.dplayer.dp
  }
}
</script>

<style lang="less" scoped>
.vuedetail-container {
  display: flex;
  flex-direction: row;
  margin: 15px 5rem 15px;
  .video-title {
    margin-bottom: 15px;
  }
  .dplayer {
    flex: 1;
    width: 50rem;
    height: 30rem;
  }
  .video-star-co-view {
    margin-top: 15px;
    .video-btn-views {
      border: none;
    }
    .video-btn-views:hover {
      cursor: default;
      color: #606266;
      background-color: #fff;
    }
  }
  .video-sapn {
    .video-btn {
      padding: 5px;
      /deep/ span {
        margin-left: 3px;
        font-size: 10px;
      }
    }
  }
  .video-sapn:not(:first-child) {
    margin-left: 20px;
  }
}
</style>
