<template>
  <div class="sysinfo-container">
    <el-card class="box-card-top" :body-style="{ padding: '10px' }">
      <div>系统通知</div>
    </el-card>
    <div class="infinite-list-wrapper" style="overflow:auto">
      <ul class="list" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
        <el-card class="box-card-sys" :body-style="{ padding: '10px'}" v-for="sys in sysinfos" :key="sys.id">
          <div>
            <span class="sys-title">{{ sys.title }}</span>
            <span class="sys-date">{{ $moment(sys.sysDate).format('YYYY年MM月DD日 HH:mm:ss') }}</span>
          </div>
          <div>
            <p class="sys-content">{{ sys.content }}<el-link :href="sys.link" icon="el-icon-link"><span>网页链接</span></el-link>
            </p>
          </div>
        </el-card>
      </ul>
      <p v-if="loading" class="box-card-tips">加载中...</p>
      <p v-if="noMore" class="box-card-tips">没有更多了...</p>
    </div>
  </div>
</template>

<script>
import { getAllSysInfo } from '@/api/message.js'

export default {
  name: 'sysinfo-vue',
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
      disabled: false
    }
  },
  methods: {
    async fetSysInfos() {
      // 初始化切割数据数组的相关数据
      this.obj = []
      this.objKey = 0

      const { data: res } = await getAllSysInfo()
      console.log(res)
      if (res.flag && res.data) {
        this.sysinfos = res.data
        // 按groupcount切割数组，分组(每组groupcount条数据)
        for (let i = 0; i < Math.ceil(this.sysinfos.length / this.groupcount); i++) {
          this.obj[i] = this.sysinfos.slice(i * this.groupcount, i * this.groupcount + this.groupcount)
        }
        // 预加载前 groupcount(默认10)条
        this.sysinfos = this.obj[this.objKey]
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
          this.sysinfos = this.sysinfos.concat(this.obj[this.objKey])
          this.loading = false
        }
      }, 1000)
    }
  },
  created() {
    this.fetSysInfos()
  }
}
</script>

<style lang="less" scoped>
.sysinfo-container {
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
  .box-card-sys {
    margin-top: 10px;
    .sys-title {
      color: #333;
      font-weight: 700;
      line-height: 24px;
      font-family: 'Microsoft YaHei', 'Microsoft Sans Serif', 'Microsoft SanSerf';
    }
    .sys-date {
      color: #999;
      font-size: 12px;
      line-height: 22px;
      margin: 0 10px;
    }
    .sys-content {
      margin-top: 8px;
      word-break: break-word;
      color: #666;
      padding-left: 8px;
      line-height: 19px;
      font-size: 12px;
    }
  }
  .box-card-tips {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
