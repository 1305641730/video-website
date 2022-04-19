<template>
  <div class="video-container">
    <!-- 走马灯 -->
    <div class="carousel">
      <el-carousel height="300px">
        <el-carousel-item v-for="img in imglist" :key="img">
          <img :src="img" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 视频类型标签 -->
    <div class="video-tags">
      <el-tag v-for="tag in tags" :key="tag.id">{{ tag.name }}</el-tag>
    </div>
    <!-- 视频列表 -->
    <div class="video-list">
      <VideoList :videos="videos" :total="total" @handleCurrentChange="CurrentPageChange"></VideoList>
    </div>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'
import { getVideos, getVideoTypes } from '@/api/video.js'

export default {
  name: 'video-vue',
  data() {
    return {
      imglist: [require('@/assets/carousel.jpg'), require('@/assets/carousel2.jpg'), require('@/assets/carousel3.jpg'), require('@/assets/carousel4.jpg')],
      videos: null,
      tags: [],
      pageNum: 1,
      pageSize: 12,
      total: 0
    }
  },
  components: {
    VideoList
  },
  methods: {
    async fetchVideos() {
      const { data: res } = await getVideos(this.pageNum, this.pageSize)
      this.videos = res.data.list
      this.total = res.data.total
      console.log(res)
    },
    async fetchVideoTypes() {
      const { data: res } = await getVideoTypes()
      this.tags = res.data
    },
    CurrentPageChange(currentPage) {
      console.log('当前页：' + currentPage)
      this.pageNum = currentPage
      this.fetchVideos()
    }
  },
  created() {
    this.fetchVideos()
    this.fetchVideoTypes()
  }
}
</script>

<style lang='less' scoped>
.carousel {
  margin: 15px 0;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.video-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  .el-tag {
    width: 80px;
    text-align: center;
  }
}
.video-list {
  margin: 15px 0;
}
.el-carousel__item {
  background-color: #99a9bf;
}
</style>
