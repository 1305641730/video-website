<template>
  <div class="videosearch-container">
    <div class="search-div">
      <el-input placeholder="请输入内容" v-model="contentData" clearable @keyup.enter.native="searchVideos">
        <i class="el-icon-search" slot='prepend'></i>
        <el-button slot="append" type="primary" @click="searchVideos">搜索</el-button>
      </el-input>
    </div>
    <el-tabs class="search-videos_tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="最新发布" name="first">
        <VideoList :videos="videos"></VideoList>
        <!-- 搜索到的视频数为0时显示 -->
        <div class="search-video-mask" v-if="videos === null || videos.length === 0">
          暂无所搜寻的内容
        </div>
      </el-tab-pane>
      <el-tab-pane label="最多播放" name="second">
        <VideoList :videos="videos"></VideoList>
        <!-- 搜索到的视频数为0时显示 -->
        <div class="search-video-mask" v-if="videos === null || videos.length === 0">
          暂无所搜寻的内容
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoList from '@/components/VideoList.vue'
import { getVideosBykeyword } from '@/api/video.js'

export default {
  name: 'videosearch-vue',
  props: {
    content: {
      required: true,
      type: String
    }
  },
  components: {
    VideoList
  },
  data() {
    return {
      activeName: 'first',
      videos: null,
      contentData: this.content
    }
  },
  methods: {
    // 处理我的视频下导航菜单选择事件
    handleClick(tab) {
      if (tab === 'first') {
        this.searchVideos()
      } else {
        this.videos = this.videos.sort((a, b) => b.views - a.views)
      }
    },
    async searchVideos() {
      const { data: res } = await getVideosBykeyword(this.contentData)
      console.log(res)
      this.videos = res.data
    }
  },
  mounted() {
    console.log(this.content)
    this.searchVideos()
  }
}
</script>

<style lang='less' scoped>
.videosearch-container {
  margin-bottom: 15px;
  .search-div {
    margin-top: 15px;
  }
  .search-div {
    width: 640px;
    margin: 15px auto;
  }
  .search-video-mask {
    text-align: center;
    color: #99a2aa;
    a {
      color: #00a1d6;
    }
  }
}
</style>
