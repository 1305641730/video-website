<template>
  <div class="reply-container">
    <el-card class="box-card-top" :body-style="{ padding: '10px' }">
      <div>回复我的</div>
    </el-card>
    <div class="infinite-list-wrapper" style="overflow:auto">
      <ul class="list" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <el-card :body-style="{padding: '10px'}">
          <el-row :gutter="20" class="comment_area" v-for="(comment) in comments" :key="comment.id">
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar :size="50" :src="!comment.user.avatar? require('@/assets/noface.gif'): comment.user.avatar"></el-avatar>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <p class="com_user">{{ comment.user.username }}</p>
                <p class="com_content">{{ comment.content }}</p>
                <div class="com_bottom">
                  <span class="com_date">{{ $moment(comment.comDate).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  <div class="com_star">
                    <i class="el-icon-thumb"></i>
                    <span>{{ comment.stars? comment.stars: 0 }}</span>
                  </div>
                  <span class="btn_replay" @click="showDialog(comment)">回复</span>
                </div>
              </div>

              <!-- 二级评论回复对话框 -->
              <div v-if="isShowDialog2 && comment.id === showDialogIndex">
                <!-- 二级评论回复对话框（登录后） -->
                <el-row :gutter="20" v-if="$store.state.userId" class="comment_dialog">
                  <!-- 评论用户头像 -->
                  <el-col :span="2">
                    <div class="grid-content">
                      <div class="demo-basic--circle">
                        <div class="block">
                          <el-avatar :size="50" :src="avatar"></el-avatar>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <!-- 评论对话框 -->
                  <el-col :span="20">
                    <div class="grid-content">
                      <el-input type="textarea" :rows="2" :placeholder="'回复 @' + tempUserName + ':'" v-model="comContent2">
                      </el-input>
                    </div>
                  </el-col>
                  <!-- 发表按钮 -->
                  <el-col :span="2">
                    <div class="grid-content">
                      <el-button type="primary" class="btn_com" @click="sendComment2">回复评论</el-button>
                    </div>
                  </el-col>
                </el-row>
                <!-- 二级评论回复对话框（登录前） -->
                <el-row :gutter="20" v-else>
                  <!-- 评论用户头像 -->
                  <el-col :span="3">
                    <div class="grid-content">
                      <div class="demo-basic--circle">
                        <div class="block">
                          <el-avatar :size="50" :src="avatar"></el-avatar>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <!-- 评论对话框 -->
                  <el-col :span="16" class="com_mask_div">
                    <div class="grid-content">
                      <el-input type="textarea" :rows="2">
                      </el-input>
                    </div>
                    <div class="grid-content comment_mask">
                      <span>请<button class="btn_info" @click="$router.push('/login')">登录</button>后再评论( • ̀ω•́ )✧</span>
                    </div>
                  </el-col>
                  <!-- 遮罩 -->
                  <!-- 发表按钮 -->
                  <el-col :span="4">
                    <div class="grid-content">
                      <el-button type="info" disabled class="btn_com">回复</el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="text-box">{{ comment.comUserContent }}</div>
            </el-col>
          </el-row>
        </el-card>
      </ul>
      <p v-if="loading" class="box-card-tips">加载中...</p>
      <p v-if="noMore" class="box-card-tips">没有更多了...</p>
    </div>
  </div>
</template>

<script>
import { getCommentsByUserId, sendComments } from '@/api/comment.js'

export default {
  name: 'reply-vue',
  data() {
    return {
      sysinfos: null,
      // 数据分组
      obj: [], // 数据分组的数组
      objKey: 0, // 第几组
      // 每次加载多少条(每组多少条)
      groupcount: 10,
      // 是否加载
      loading: false,
      // 是否到底(即数据加载完毕)
      noMore: false,
      // 是否可j继续滚动加载
      disabled: false,
      // 回复我的评论数据
      comments: null,
      showDialogIndex: 0,
      isShowDialog2: false,
      tempComment: null,
      tempUserName: '',
      // 回复对话框内容
      avatar: this.$store.state.avatar ? this.$store.state.avatar : require('@/assets/noface.gif'),
      comContent2: ''
    }
  },
  methods: {
    async fetchComments() {
      this.obj = []
      this.objKey = 0

      const { data: res } = await getCommentsByUserId(this.$store.state.userId)
      console.log(res)
      if (res.flag && res.data) {
        this.comments = res.data
        // 过滤掉自己回复自己的
        this.comments = this.comments.filter(comment => comment.user.id !== this.$store.state.userId)
        // 按groupcount切割数组，分组(每组groupcount条数据)
        for (let i = 0; i < Math.ceil(this.comments.length / this.groupcount); i++) {
          this.obj[i] = this.comments.slice(i * this.groupcount, i * this.groupcount + this.groupcount)
        }
        // 预加载前 groupcount(默认10)条
        this.comments = this.obj[this.objKey]
      }
    },
    load() {
      // 首次加载
      this.loading = true
      setTimeout(() => {
        this.objKey++
        // 如果是最后一组，停止加载
        if (this.objKey > this.obj.length - 1) {
          this.loading = false
          this.noMore = true
          this.disabled = true
        } else {
          // 不是最后一组，继续添加下一组
          this.comments = this.comments.concat(this.obj[this.objKey])
          this.loading = false
        }
      }, 1000)
    },
    showDialog(comment) {
      this.tempUserName = comment.user.username
      this.isShowDialog2 = true
      this.showDialogIndex = comment.id
      this.tempComment = comment
    },
    async sendComment2() {
      // 去除评论内容首位空格和换行
      this.comContent2 = this.comContent2.replace(/^\s+|\s+$/g, '')
      const resComment = {
        user: {
          id: this.tempComment.comUserId
        },
        comUserId: this.tempComment.user.id,
        comCommentId: this.tempComment.id,
        commentId: this.tempComment.commentId,
        videoId: this.tempComment.videoId,
        content: this.comContent2,
        comDate: new Date()
      }
      console.log(resComment)
      const { data: res } = await sendComments(resComment)
      if (res.flag && res.data) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this.comContent2 = ''
      this.fetchComments()
    }
  },
  created() {
    this.fetchComments()
  }
}
</script>

<style lang="less" scoped>
.reply-container {
  height: 100%; // 继承父容器高度
  padding: 10px 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // 修改滚动条样式
  ::-webkit-scrollbar {
    width: 6px;
  }
  // 定义滚动条的轨道颜色、内阴影及圆角
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: transparent;
    border-radius: 3px;
  }
  // 定义滑块颜色、内阴影及圆角
  ::-webkit-scrollbar-thumb {
    border-radius: 7px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #aaa;
  }
  .el-card,
  .infinite-list-wrapper {
    width: 100%;
  }
  .infinite-list-wrapper {
    flex: 1;
    padding-bottom: 60px;
  }
  .box-card-tips {
    margin-top: 10px;
    text-align: center;
  }

  .el-row {
    margin-top: 10px;
  }
  .el-card {
    margin-top: 10px;
  }
  .comment_title {
    padding: 20px 0 0;
  }
  .comment_dialog,
  .comment_area {
    padding: 0 8px 10px;
    .text-box {
      width: 60px;
      height: 60px;
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      font-size: 14px;
      line-height: 15px;
      max-height: 4.285714285714286em;
    }
  }
  .comment_area:not(:last-child) {
    padding: 0 8px 10px;
    border-bottom: 1px solid #e5e9ef;
  }
  .com_user {
    color: #6d757a;
    vertical-align: middle;
    font-weight: bold;
    font-size: 14px;
  }
  .com_content {
    line-height: 20px;
    padding: 2px 0;
    font-size: 14px;
    text-shadow: none;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .com_bottom {
    color: #99a2aa;
    line-height: 14px;
    margin-top: 6px;
    font-size: 12px;
    .com_date {
      margin-right: 20px;
    }
    .el-icon-thumb {
      margin-right: 5px;
    }
    .com_star {
      display: inline;
      cursor: pointer;
    }
    .btn_replay {
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
</style>
