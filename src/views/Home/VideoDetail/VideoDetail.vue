<template>
  <div class="vuedetail-container">
    <div class="video_left">
      <div class="dplayer" ref="dplayer"></div>
      <Comment v-if="isCommentShow" ref="comment" :avatar="avatar" :comments="comments" @sendComment="handleComment" @sendComment2="handleComment2"></Comment>
    </div>
    <div class="video_right"></div>
  </div>
</template>

<script>
import Dplayer from 'dplayer'
import { getVideoById } from '@/api/video.js'
import { sendComments, getComments } from '@/api/comment.js'
import Comment from '@/components/Comment.vue'

export default {
  name: 'videodetail-vue',
  props: ['id'],
  data() {
    return {
      // 视频组件数据
      player: null,
      dp: null,
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
    // 获取视频
    async fetchVideo() {
      const { data: res } = await getVideoById(this.id)
      console.log(res)
      this.dp = new Dplayer({
        container: this.$refs.dplayer,
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
        comUser: {
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
        // 对评论数据加工为二级
        const data = []
        for (let i = 0; i < res.data.length; i++) {
          const comment = res.data[i]
          comment.child = []
          for (let j = 0; j < res.data.length; j++) {
            const comment2 = res.data[j]
            if (comment2.commentId === comment.id) {
              comment.child.push(comment2)
            }
          }
          data.push(comment)
        }
        this.comments = data.filter(item => item.commentId === null)
        this.refreshComment()
      }
    },
    // 二级评论回复
    async handleComment2(comment, content) {
      // 去除评论内容首位空格和换行
      content = content.replace(/^\s+|\s+$/g, '')
      const resComment = {
        comUser: {
          id: this.$store.state.userId
        },
        comUserId: comment.comUser.id,
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
  margin: 15px 5rem 0;
  .dplayer {
    flex: 1;
    width: 42rem;
    height: 28rem;
  }
}
</style>
