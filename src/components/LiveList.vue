<template>
  <div class="livelist-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="live in lives" :key="live.id" @click.native="gotoVideoDetail(live.id)">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="live.liveCover" class="video-cover">
          <div style="padding: 14px;">
            <div>
              <span class="live-tiny-card">
                <img :src="liveimg" alt="">
                <span>直播中...</span>
              </span>
              <span class="video-title">{{ live.livename }}</span>
            </div>
            <div class="video-bottom clearfix">
              <span>{{ live.user.username }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination background layout="prev, pager, next" :total="total" :page-count="2" :hide-on-single-page="isShow" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'livelist-vue',
  props: {
    lives: {
      type: Array,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShow: this.total <= 12,
      liveimg: require('@/assets/live.gif')
    }
  },
  methods: {
    gotoLiveDetail(id) {
      this.$router.push({ name: 'live', params: { id: id } })
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang="less" scoped>
.livelist-container {
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
    font-size: 13px;
    margin-top: 5px;
    color: #9499a0;
  }
  .live-tiny-card {
    img {
      margin-left: 4px;
      margin-right: 3px;
      width: 12px;
      height: 12px;
    }
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    display: -webkit-inline-flex;
    display: inline-flex;
    margin-right: 4px;
    padding-right: 4px;
    height: 18px;
    font-size: 12px;
    line-height: 16px;
    font-weight: normal;
    color: #ff6699;
    border: 1px solid #ff6699;
    border-radius: 4px px;
    box-sizing: border-box;
    user-select: none;
    transform: translateY(1px);
  }
  .video-title {
    margin-left: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .el-pagination {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
