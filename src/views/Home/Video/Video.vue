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
      <div class="video-list-top">
        <i class="el-icon-video-camera"></i>
        <span>最新推荐</span>
      </div>
      <VideoList :videos="videos" :total="total" @handleCurrentChange="CurrentPageChange"></VideoList>
    </div>
    <!-- 直播列表 -->
    <div class="video-list">
      <div class="video-list-top">
        <i class="el-icon-video-camera-solid"></i>
        <span>直播间</span>
      </div>
      <LiveList :lives="lives" :total="total2" @handleCurrentChange="CurrentPageChange"></LiveList>
    </div>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'
import LiveList from '@/components/LiveList.vue'
import { getVideos, getVideoTypes } from '@/api/video.js'
import { getLives } from '@/api/live.js'

export default {
  name: 'video-vue',
  data() {
    return {
      imglist: [require('@/assets/carousel.jpg'), require('@/assets/carousel2.jpg'), require('@/assets/carousel3.jpg'), require('@/assets/carousel4.jpg')],
      videos: null,
      tags: [],
      // 视频分页数据
      pageNum: 1,
      pageSize: 12,
      total: 0,
      // 直播间分页数据
      lives: null,
      pageNum2: 1,
      pageSize2: 12,
      total2: 0
    }
  },
  components: {
    VideoList,
    LiveList
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
    async fetchAllLives() {
      const { data: res } = await getLives(this.pageNum2, this.pageSize2)
      console.log(res)
      this.lives = res.data.list
      this.total2 = res.data.total
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
    this.fetchAllLives()
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
.video-list-top {
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  i {
    font-size: 20px;
  }
  span {
    margin-left: 10px;
  }
}
.video-list {
  margin: 15px 0;
}
.el-carousel__item {
  background-color: #99a9bf;
}
</style>
