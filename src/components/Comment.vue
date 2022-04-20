<template>
  <div class="comment-container">
    <h3 class="comment_title">评论</h3>
    <!-- 评论回复对话框（登录后） -->
    <el-row :gutter="10" v-if="$store.state.userId" class="comment_dialog">
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
      <el-col :span="19">
        <div class="grid-content">
          <el-input type="textarea" :rows="2" placeholder="说点什么吧..." v-model="comContent">
          </el-input>
        </div>
      </el-col>
      <!-- 发表按钮 -->
      <el-col :span="3">
        <div class="grid-content">
          <el-button type="primary" class="btn_com" @click="sendComment">发表</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 评论回复对话框（登录前） -->
    <el-row :gutter="20" v-else>
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
      <el-col :span="18" class="com_mask_div">
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
          <el-button type="info" disabled class="btn_com">发表评论</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 评论区 -->
    <!-- 一级评论 -->
    <el-row :gutter="20" class="comment_area mt-1" v-for="(comment) in commentsData" :key="comment.id">
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="50" :src="!comment.user.avatar? require('@/assets/noface.gif'): comment.user.avatar"></el-avatar>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content bg-purple">
          <p class="com_user">{{ comment.user.username }}</p>
          <p class="com_content">{{ comment.content }}</p>
          <div class="com_bottom">
            <span class="com_date">{{ $moment(comment.comDate).format('YYYY-MM-DD HH:mm:ss') }}</span>
            <div class="com_star">
              <i class="el-icon-thumb"></i>
              <span>{{ comment.stars? comment.stars: 0 }}</span>
            </div>
            <span class="btn_replay" @click="showDialog(comment.id, comment)">回复</span>
          </div>
        </div>

        <!-- 二级评论 -->
        <el-row :gutter="40" class="comment_area mt-1" v-for="(comment2) in comment.child" :key="comment2.id">
          <div v-if="comment2.commentId === comment.id">
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <div class="demo-basic--circle">
                  <div class="block">
                    <el-avatar :size="50" :src="!comment2.user.avatar? require('@/assets/noface.gif'): comment2.user.avatar"></el-avatar>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="22">
              <div class="grid-content bg-purple">
                <p class="com_user">{{ comment2.user.username }}</p>
                <p class="com_content">
                  <span v-if="comment2.comUserId">回复
                    <a href="#" class="replay_user_a">@{{ comment2.comUserName }}</a>
                  </span>:
                  <span>{{ comment2.content }}</span>
                </p>
                <div class="com_bottom">
                  <span class="com_date">{{ $moment(comment2.comDate).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  <div class="com_star">
                    <i class="el-icon-thumb"></i>
                    <span>{{ comment2.stars? comment2.stars: 0 }}</span>
                  </div>
                  <span class="btn_replay" @click="showDialog2(comment.id, comment2.id, comment2)">回复</span>
                </div>
              </div>
            </el-col>
          </div>
        </el-row>

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
                <el-input type="textarea" :rows="2" :placeholder="'回复 @' + tempComment.comUserName + ':'" v-model="comContent2">
                </el-input>
              </div>
            </el-col>
            <!-- 发表按钮 -->
            <el-col :span="2">
              <div class="grid-content">
                <el-button type="primary" class="btn_com" @click="sendComment2">发表评论</el-button>
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
                <el-button type="info" disabled class="btn_com">发表评论</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="loading-state">
      <span v-if="isLoading"><i class="el-icon-loading" />正在加载中....</span>
      <span v-else>没有更多评论</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comment-vue',
  props: {
    avatar: null,
    comments: null,
    groupcount: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      comContent: '',
      comContent2: '',
      tempComment: null,
      isShowDialog2: false,
      showDialogIndex: 0,
      isLoading: false,
      commentsData: this.comments,
      // 评论数据分组数据
      obj: [], // 用来存放评论数组
      objKey: 0 // 用来存放数组对象的下标
    }
  },
  methods: {
    sendComment() {
      this.$emit('sendComment', this.comContent)
    },
    resetComment() {
      this.comContent = ''
    },
    resetComment2() {
      this.comContent2 = ''
    },
    showDialog(commentId, comment) {
      this.isShowDialog2 = true
      this.tempComment = comment
      this.tempComment.commentId = commentId
      this.showDialogIndex = commentId
    },
    showDialog2(commentId, comCommentId, comment) {
      this.isShowDialog2 = true
      this.tempComment = comment
      this.tempComment.comCommentId = comCommentId
      this.tempComment.commentId = commentId
      this.showDialogIndex = commentId
    },
    sendComment2() {
      this.$emit('sendComment2', this.tempComment, this.comContent2)
    },
    // 浏览器滚动监听事件
    scrollBrowse() {
      // this.$emit('scrollBrowse')
      // 获取窗口高度
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      // 获取滚动的高度
      const scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 获取文档的高度
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight

      if (windowHeight + scrollHeight >= docHeight) {
        // 触底加载后续内容
        console.log('触底')
        this.objKey++
        if (this.objKey > this.obj.length - 1) {
          this.isLoading = false
        } else {
          this.commentsData = this.commentsData.concat(this.obj[this.objKey]) // 合并后一组评论
        }
        // console.log(this.commentsData)
      }
    }
  },
  created() {
    // 初始化评论数据分组数据
    this.obj = []
    this.objKey = 0
    // 将评论数据按 传过来的groupcount(默认10) 条一组方式进行分组
    if (this.commentsData) {
      if (this.commentsData.length > this.groupcount) {
        this.isLoading = true
        // 向上取整，一共多少组
        for (let i = 0; i < Math.ceil(this.commentsData.length / this.groupcount); i++) {
          this.obj[i] = this.commentsData.slice(this.groupcount * i, this.groupcount * i + this.groupcount)
        }
        this.commentsData = this.obj[this.objKey] // 初始加载前10条(第一组)
      } else {
        this.isLoading = false
      }
    }
  },
  mounted() {
    // 给窗口添加滚动事件
    window.addEventListener('scroll', this.scrollBrowse)
  },
  beforeDestroy() {
    // 移除窗口滚动事件
    window.removeEventListener('scroll', this.scrollBrowse)
  }
}
</script>

<style lang='less' scoped>
.comment-container {
  .el-row {
    margin-top: 10px;
  }
  .comment_title {
    padding: 20px 0 0;
  }
  .comment_dialog,
  .comment_area {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #e5e9ef;
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
  .mt-1 {
    margin-top: 30px;
  }
  .btn_com {
    height: 54px;
  }
  .replay_user_a {
    color: #008ac5;
  }
  .com_mask_div {
    position: relative;
    .comment_mask {
      position: absolute;
      background-color: #f1f1f1;
      left: 5px;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn_info {
        background-color: skyblue;
        padding: 5px 10px;
        margin: 0 5px;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
  .loading-state {
    height: 64px;
    line-height: 64px;
    font-size: 12px;
    color: #9499a0;
    text-align: center;
  }
}
</style>
