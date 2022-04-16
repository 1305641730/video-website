<template>
  <div class="videolist-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="video in videos" :key="video.id" @click.native="gotoVideoDetail(video.id)">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="video.videoCoverUrl" class="video-cover">
          <div style="padding: 14px;">
            <span class="video-title">{{ video.title }}</span>
            <div class="video-bottom clearfix">
              <i class="el-icon-thumb icon-star"></i>
              <span>{{ video.stars }}</span>
              <time class="time">{{ $moment(video.uploadDate).format('YYYY-MM-DD HH:mm:ss') }}</time>
              <i class="el-icon-star-off icon-collection"></i>
              <span>{{ video.collections }}</span>
              <i class="el-icon-view" />
              <span>{{ video.views }}</span>
              <button class="btn-delete" v-if="isShowDelete" @click.stop="handleDelete(video.id, video.title)"><i class="el-icon-delete"></i>删除</button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'videolist-vue',
  props: {
    videos: { default: [] },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowDelete: this.isDelete
    }
  },
  methods: {
    gotoVideoDetail(id) {
      this.$router.push('/detail/' + id)
    },
    handleDelete(id, title) {
      this.$emit('handleDelete', id, title)
    }
  }
}
</script>

<style lang="less" scoped>
.videolist-container {
  .el-col:nth-child(n + 5) {
    margin-top: 15px;
  }
  .el-card {
    cursor: pointer;
    min-width: 280px;
    min-height: 200px;
  }
  .video-cover {
    display: block;
    width: 100%;
    height: 140px;
  }
  .video-bottom {
    font-size: 10px;
    margin-top: 5px;
    > *:not(:first-child):not(span) {
      margin-left: 10px;
    }
    .btn-delete {
      cursor: pointer;
      border: 0;
      background: none;
      font-size: 10px;
    }
  }
  /deep/ .video-bottom {
    span {
      margin-left: 5px;
    }
  }
  .video-title {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
