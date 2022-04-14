<template>
  <div class="videolist-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="video in videos" :key="video.id" @click.native="gotoVideoDetail(video.id)">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="video.videoCoverUrl" class="video-cover">
          <div style="padding: 14px;">
            <span class="video-title">{{ video.title }}</span>
            <div class="bottom clearfix">
              <i class="el-icon-thumb icon-star"></i>
              <span>{{ video.stars }}</span>
              <time class="time">{{ $moment(video.uploadDate).format('YYYY-MM-DD HH:mm:ss') }}</time>
              <i class="el-icon-star-off icon-collection"></i>
              <span>{{ video.collections }}</span>
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
  props: ['videos'],
  data() {
    return {}
  },
  methods: {
    gotoVideoDetail(id) {
      this.$router.push('/detail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.videolist-container {
  margin: 15px 5rem 0;
  .video-cover {
    display: block;
    width: 100%;
    height: 140px;
  }
  .bottom {
    font-size: 10px;
    margin-top: 5px;
    > *:not(:first-child) {
      margin-left: 10px;
    }
  }
  .el-card {
    cursor: pointer;
    min-width: 240px;
  }
  .video-title {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
