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
    <!-- 视频列表 -->
    <div class="video-list">
      <VideoList :videos="videos"></VideoList>
    </div>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'
import { getVideos } from '@/api/video.js'

export default {
  name: 'video-vue',
  data() {
    return {
      imglist: [require('@/assets/carousel.jpg'), require('@/assets/carousel2.jpg'), require('@/assets/carousel3.jpg'), require('@/assets/carousel4.jpg')],
      videos: []
    }
  },
  components: {
    VideoList
  },
  methods: {
    async fetchVideos() {
      const { data: res } = await getVideos()
      this.videos = res.data
      console.log(res)
    }
  },
  created() {
    this.fetchVideos()
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

.el-carousel__item {
  background-color: #99a9bf;
}
</style>
