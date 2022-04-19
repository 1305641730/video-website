<template>
  <div class="upload-container">
    <el-row>
      <el-col class="el-col-aside" :span="4">
        <!-- 视频上传管理菜单 -->
        <el-menu default-active="1" class="upload-menus" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">视频投稿</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">稿件管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <!-- 视频上传 -->
        <div class="upload-content">
          <!-- 视频上传文件 -->
          <div class="upload-demo">
            <el-upload drag action="#" accept=".mp4,.flv" :http-request="handleUploadVideo" multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip"></div>
            </el-upload>
            <!-- 封面 -->
            <div class="upload-cover">
              <el-upload list-type="picture-card" action="#" :http-request="handleUploadImg" :show-file-list="false">
                <img v-if="this.uploadVideoInfo.videoCoverUrl" :src="this.uploadVideoInfo.videoCoverUrl" class="avatar" style="width: 100%; height: 100%" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1G</div>
            </div>
          </div>
          <!-- 视频上传信息 -->
          <el-form :model="uploadVideoInfo" status-icon ref="uploadVideoInfo" label-width="100px" label-position="top" class="upload-form">
            <el-form-item label="标题" prop="title">
              <el-input v-model="uploadVideoInfo.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="视频类型" prop="type">
              <el-select v-model="value" placeholder="请选择视频类型" @change="selectChange">
                <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视频简介" prop="desc">
              <el-input type="textarea" v-model="uploadVideoInfo.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getVideoTypes, uploadImg, uploadVideo, uploadVideoInfo } from '@/api/video.js'

export default {
  name: 'upload-vue',
  data() {
    return {
      types: [],
      value: '',
      uploadVideoInfo: {
        user: {
          id: null
        },
        title: '',
        type: {
          id: null
        },
        uploadDate: null,
        desc: '',
        videoCoverUrl: '',
        videoUrl: ''
      }
    }
  },
  methods: {
    async handleUploadVideo({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      const { data: res } = await uploadVideo(formData)
      console.log(res.data)
      this.uploadVideoInfo.videoUrl = res.data
    },
    async handleUploadImg({ file }) {
      console.log(file)
      const isImage = ['png', 'jpeg', 'jpg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      const formData = new FormData()
      const arr = file.name.split('.')
      const suffix = arr[arr.length - 1]
      if (isImage.indexOf(suffix) === -1) {
        return this.$message.error('文件格式错误')
      }
      formData.append('file', file)
      const { data: res } = await uploadImg(formData)
      console.log(res.data)
      this.uploadVideoInfo.videoCoverUrl = res.data
    },
    selectChange(typeId) {
      this.uploadVideoInfo.type.id = typeId
    },
    async fetchVideoTypes() {
      const { data: res } = await getVideoTypes()
      this.types = res.data
    },
    async submitForm() {
      if (this.uploadVideoInfo.videoUrl === '') {
        this.$message.error('请上传视频后再提交')
        return false
      }
      // if (this.uploadVideoInfo.videoCoverUrl === '') {
      //   this.$message.error('请上传视频封面后再提交')
      //   return false
      // }
      this.uploadVideoInfo.uploadDate = new Date()
      const { data: res } = await uploadVideoInfo(this.uploadVideoInfo)
      console.log(res)
      this.$message.success(res.msg)
    }
  },
  created() {
    this.fetchVideoTypes()
    this.uploadVideoInfo.user.id = this.$store.state.userId
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-col-aside {
  height: 600px;
  background-color: rgb(84, 92, 100);
}

.upload-container {
  margin-top: 20px;
}

.upload-content {
  margin: 0 6rem;
  display: flex;
  flex-direction: column;
  .upload-demo {
    display: flex;
  }
  .upload-cover {
    display: flex;
    flex-direction: column;
    width: 360px;
    height: 207px;
    margin-left: 30px;
  }
  .upload-form {
    margin-top: 30px;
  }
}
// 封面组件
/deep/ .el-upload--picture-card {
  width: 100%;
  height: 180px;
}
</style>
