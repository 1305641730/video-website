# 前端

## 一、使用element-ui遇到的问题

### 1. el-menu 宽度不是100%

![image-20220329221611377](README.assets/image-20220329221611377.png)

~~~vue
<template>
  <el-container>
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4"></el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
~~~

> 原因：
>
> 最外层 el-header 有 padding 导致 el-menu 没有100%的宽度

![image-20220329221733706](README.assets/image-20220329221733706.png)

> 解决：

~~~css
<style lang="less" scoped>
.el-header {
  padding: 0;
}
</style>
~~~

### 2. 去除 NavMenu 底部高亮

![image-20220329224039273](README.assets/image-20220329224039273.png)

~~~css
.el-menu-item {
  line-height: 50px;
  height: 50px;
  .is-active {
    // border-bottom: 0;
  }
}
~~~

### 3. 修改 icon 颜色

~~~
.el-menu-item {
  /deep/ i {
    color: white;
  }
}
~~~

### 4. 修改 `element.style` 中的样式

> 直接在相关element组件中HTML部分,设置style="" 即可修改成功.

![image-20220331140845800](README.assets/image-20220331140845800.png)

![image-20220331140928200](README.assets/image-20220331140928200.png)

### 5. element-ui 回车提交表单

![image-20220408161844120](README.assets/image-20220408161844120.png)

~~~vue
<el-form :model="loginForm" status-icon ref="ruleForm" class="login-form" @keyup.enter.native="submitForm">
    ...
</el-form>
~~~

### 6. 实现文本单行显示

~~~css
.video-title {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
~~~

### 7. vue element-ui 中事件的触发

> element-ui 中的事件都要加上 `.native` 才能出发, 例如：@click.native, @keyup.enter.native

### 8. 解决 `vuex` 界面刷新数据丢失

~~~
npm install vuex-persistedstate --save
~~~

~~~javascript
// store.js
import createPersistedState from "vuex-persistedstate"
const store =newVuex.Store({
 state: {},
 mutations: {},
 actions: {},
 plugins: [createPersistedState()]
})
~~~

### 9. vue 强制刷新子组件

~~~
<Header @loginOut="handleLoginOut" v-if="isResetHeader" />
...
~~~

~~~javascript
handleLoginOut() {
      刷新前操作...
      this.isResetHeader = false
      this.$nextTick(() => {
        this.isResetHeader = true
      })
}
~~~

### 10. vue 父组件调用子组件的方法

> 方法一：通过ref直接调用子组件的方法；

~~~javascript
...
export default {
    methods: {
        handleClick() {
           this.$refs.child.sing();
        },
    },
}
...
~~~

> 方法二：通过组件的$emit、$on方法；

~~~javascript
// 父组件
export default {
    methods: {
        handleClick() {
               this.$refs.child.$emit("childmethod")    //子组件$on中的名字
        },
    },
}
~~~

~~~javascript
// 子组件
export default {
    mounted() {
        this.$nextTick(function() {
            this.$on('childmethods', function() {
                console.log('我是子组件方法');
            });
        });
     },
};
~~~

### 11. 去除评论内容首位空格和换行

~~~javascript
comment = comment.replace(/^\s+|\s+$/g, '')
~~~

### 12. 为上传头像添加蒙版

* 效果

![image-20220413130355009](README.assets/image-20220413130355009.png)

> 注意点：
>
> ​	:hover 伪元素只能改变子元素的样式，不同改变同级元素样式。

~~~vue
...
<el-form-item label="头像">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleUploadAvatar">
                  <div class="avatar-div">
                    <el-avatar :size="60" :src="userForm.avatar">
                    </el-avatar>
                    <div class="avatar-mask">更换头像</div>
                  </div>
                </el-upload>
</el-form-item>
...
<style lang="less" scoped>
...
.avatar-div {
  position: relative;
}
.avatar-mask {
  position: absolute;
  text-align: center;
  line-height: 60px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}
.avatar-div:hover .avatar-mask {
  opacity: 0.8;
}
</style>
~~~

### 13. element-ui 让 el-avatar 中头像居中显示

~~~css
/deep/ .el-avatar {
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
 }
~~~

### 14. Vue 中监听 vuex 数据变化 

* a组件修改vuex内数据，b组件内触发相应函数

~~~javascript
// 监听vuex中avatar数据变化
computed: {
  avatarData() {
    return this.$store.state.avatar
  }
},
watch: {
  avatarData() {
    this.avatar = this.$store.state.avatar
    // 刷新组件
    this.refreshHeader()
  }
}
~~~

### 15. vue 实现发送验证码倒计时

~~~vue
...
<el-input v-model.trim="registerForm.email" autocomplete="off" placeholder="请输入邮箱">
          <el-button slot="append" :disabled="isBtnSend" @click="sendEmailCode">{{ btnSendInfo }}</el-button>
</el-input>
...        
<script>
export default {
	data() {
		return {
		...
        isBtnSend: false,
        btnSendInfo: '发送邮箱验证码',
        ...
	}
}
methods: {
	sendEmail() {
		...
		// 倒计时30秒之后才能再次发送验证码
        let count = 30
      	this.isBtnSend = true
      	const timer = setInterval(() => {
        	count--
        	if (count === 0) {
        	  clearInterval(timer)
        	  this.isBtnSend = false
        	  this.btnSendInfo = '获取验证码'
        	} else {
        	  this.btnSendInfo = `${count}秒后重试`
        	}
      	}, 1000)
        ...
	}
}
</script>
~~~

### 16. vue 路由重复跳转报错

~~~
Redirected when going from "/xxx" to "/yyy" via a navigation guard.报错
~~~

解决：

* 方法一：将vue-router版本降低到3.0.7，手动修改
* 方法二：复制一下代码到router.js中

~~~javascript
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
~~~

### 17. vue 实现评论滚动加载

* 子组件(评论组件)

~~~vue
<template>  
  ...
  <div>    
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
    ...
    comments: null,
    groupcount: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      ...
      isLoading: false,
      commentsData: this.comments,
      // 评论数据分组数据
      obj: [], // 用来存放评论数组
      objKey: 0 // 用来存放数组对象的下标
    }
  },
  methods: {
    ...
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
      console.log(this.commentsData)
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
...
~~~

* 父组件

~~~vue
<Comment v-if="isCommentShow" ref="comment" :avatar="avatar" :comments="comments" :groupcount="10" @sendComment="handleComment" @sendComment2="handleComment2"></Comment>
~~~

### 18. vue 使用 el-popover 带有padding如何消除（失效）

> 注意：我出现的问题是将el-popover使用在子组件中，想在子组件的<style></style>中去除padding，结果无效。打开F12仔细观察，发现popover的弹出框是渲染在了<body>下面一级，想要修改样式只能在该界面所属父组件中修改。

![image-20220419224055450](README.assets/image-20220419224055450.png)

~~~vue
// 父组件
<style>
.el-popover {
  padding: 0;
}
</style>
~~~

### 19. Css 设置一块高宽为浏览器高度的背景图

~~~
<div class="bg"></div>
...
<style>
...
.bg {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: url('@/assets/message-bg.jpg') center/cover no-repeat fixed;
    -webkit-background-size: cover;
}
</style>
~~~

> 注意：此时要为其它元素设置权重z-index，否则其它元素无法显示。

### 20. Css 设置部分布局为浏览器高度并出现滚动条

![image-20220420123240975](README.assets/image-20220420123240975.png)

> 问题描述：我想设置上方红色区域高度为浏览器高度。
>
> 解决： 使用弹性盒子布局，设置红色区域`flex:1`，并设置外层`div`相对于浏览器定位，高度100%。

~~~vue
<div class="conatiner">
	<div class="top"></div>
	<div class="main"></div>
</div>
...
<style>
.container {
	position: fixed;
	left: xxx px;
	top: xxx px;
	width: xxx px;
	height: 100%;
    display: flex;
    flex-direction: column;
    .main {
        flex: 1
    }
}
<style>
~~~

### 21. 使用element-ui的infiniteScroll组件实现滚动加载

~~~vue
<template>
  <div class="sysinfo-container">
    ...
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
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
import { getAllSysInfo } from '@/api/sysinfo.js'

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
...
~~~

## 前端的一些留下的问题

### 1. vue 中 proxy 的作用

### 2. CSS 如何自适应布局 

# 后端

## 一、使用springmvc遇到的问题

### 1. 报错：Invalid bound statement (not found)

![image-20220331091813509](README.assets/image-20220331091813509.png)

> 原因：
>
> ​	`UserMapper.class` 与 `UserMapper.xml` 没有编译在同一文件夹下说明 `UserMapper.xml` 所处文件夹 `com.kurumi.mapper`是一个整体，创建的时候就发生了问题，应该`com/kurumi/mapper`这样创建才对。

### 2. 报错：org.springframework.http.converter.HttpMessageNotWritableException

![image-20220331092643639](README.assets/image-20220331092643639.png)

> 原因
>
> ​	在SpringMVC(默认支持`jackson`)中返回Json字符串需要表明`@ResponseBody`注解，此时出现了转换异常问题分析：
>
> 1. 首先是依赖问题，确认自己安装了 `jackson` 的依赖，没问题。

~~~
<!--JSON转换-->
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-core</artifactId>
  <version>2.9.0</version>
</dependency>
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.9.0</version>
</dependency>
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-annotations</artifactId>
  <version>2.9.0</version>
</dependency>
~~~

> 2. 提供get/set方法， 发现自己只在 `ResObj` 类中定义了构造函数，没有get/set方法，加上`lombok`注解 `@Data`即可。

![image-20220331093038724](README.assets/image-20220331093038724.png)

### 3. SpringMVC 解决跨域(AJAX所引起)

> 注意：跨域可以访问目标接口，但没办法得到响应。

* 在 controller 层上加上注解 `@CrossOrigin('请求源')`

![image-20220331161934843](README.assets/image-20220331161934843.png)

* 跨域携带 cookie

> 前端

~~~javascript
$.ajax({
	type: 'GET',
	url:'',
	...
	xhrFields: {
		widthCredentials: true
	}
})
或
var xhr = new XMLHttpRequest();
xhr.withCredentials = true
~~~

> 后端(SpringMVC)
>
> 方式一: 注解 @CrossOrigin

![image-20220331212538745](README.assets/image-20220331212538745.png)

![image-20220331212546696](README.assets/image-20220331212546696.png)

> 方式二：全局配置

~~~java
// 基于类
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://domain2.com")
                .allowedMethods("PUT", "DELETE")
                .allowedHeaders("header1", "header2", "header3")
                .exposedHeaders("header1", "header2")
                .allowCredentials(false).maxAge(3600);
    }
}
~~~

~~~xml
// 基于配置文件(spring-mvc.xml)
<mvc:cors>

    <mvc:mapping path="/api/**"
        allowed-origins="http://domain1.com, http://domain2.com"
        allowed-methods="GET, PUT"
        allowed-headers="header1, header2, header3"
        exposed-headers="header1, header2" allow-credentials="false"
        max-age="123" />

    <mvc:mapping path="/resources/**"
        allowed-origins="http://domain1.com" />

</mvc:cors>
~~~

> 方式三：过滤器（实际这个好用）

~~~java
// 过滤器类
package com.ken.localserver.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CORSFilter implements Filter{

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("work");
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // 允许携带cookie
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
~~~

~~~XML
// web.xml 中配置
<!-- CORS Filter -->
<filter>
    <filter-name>CORSFilter</filter-name>
    <filter-class>com.ken.localserver.filter.CORSFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CORSFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
~~~

### 4. SpringBoot 解决跨域

~~~java
@Configuration
public class CrossConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "PUT", "POST", "DELETE")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*");
    }
}
~~~

### 5. spring 访问不到 controller

> 原因：没有将 module 部署到 tomcat 中

### 6. springmvc @RequestBody 接收多个对象参数

* 参考文章：https://blog.csdn.net/weixin_43647393/article/details/112218804

```java
// controller层
private ObjectMapper JackSon = new ObjectMapper();
...
@PostMapping("/collection")
public ResObj addCollection(@RequestBody Map<String, Object> params) {
    try {
        Video video = JackSon.readValue(JackSon.writeValueAsString(params.get("video")), Video.class);
        Collection collection = JackSon.readValue(JackSon.writeValueAsString(params.get("collection")), Collection.class);
        boolean result = videoService.addCollection(video, collection);
        return new ResObj(true, result? "收藏成功！": "收藏失败！", result);
    } catch (Exception e) {
        return new ResObj(true, e.getMessage(), null);
    }
}
```

## 二、springmvc 一些功能实现

### 1. elementui 上传图片

#### ① 前端

~~~javascript
// api/video.js
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8080/api'

...
export const uploadImg = (formData) => axios.post('/videos', formData)
...
~~~

~~~vue
<!-- 封面 -->
<div class="upload-cover">
              <el-upload list-type="picture-card" action="#" :http-request="handleHttpRequest" :show-file-list="false">
                <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" style="width: 100%; height: 100%" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</div>
...
<script>
export default {
    async handleHttpRequest({ file }) {
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
      this.dialogImageUrl = res.data
	},
}
</script>
...
~~~

#### ② 后端

* 导入坐标

~~~xml
<!--文件上传-->
<dependency>
  <groupId>commons-fileupload</groupId>
  <artifactId>commons-fileupload</artifactId>
  <version>1.2.2</version>
</dependency>
<dependency>
  <groupId>commons-io</groupId>
  <artifactId>commons-io</artifactId>
  <version>2.6</version>
</dependency>
~~~

* 配置`multipartresolver`文件上传解析器

~~~
// applicationContext.xml
<!--文件上传解析器-->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    	<!--上传文件大小限制 1*1024*1024*1024 1GB-->
        <property name="maxUploadSizePerFile" value="1073741824"/>
        <property name="defaultEncoding" value="UTF-8"/>
</bean>
~~~

* Controller

```
// com.kurumi.controller.VideoController
// 图片上传，并保存后返回图片路径
    @PostMapping
    public ResObj uploadImg(MultipartFile file, HttpServletRequest request, HttpSession session) {
        ResObj result = new ResObj();

        // 获取文件在服务器的存储位置 当前：../webapp/
        String realPath = request.getSession().getServletContext().getRealPath("/");
//        realPath = realPath.replace("target\\video_website_spring-1.0-SNAPSHOT", "src" + File.separator + "main" + File.separator + "webapp");
        System.out.println("webapp====>" + realPath);
        String originalName = file.getOriginalFilename();
        String format = simpleDateFormat.format(new Date());
        String storagePath = realPath + "imgCovers" + File.separator + format;
        File folder = new File(storagePath);
        if(!folder.exists()) {
            folder.mkdirs();
        }
        System.out.println(storagePath);

        // 获取文件后缀名
        String suffix = originalName.substring(originalName.lastIndexOf("."));
        String newfFileName = UUID.randomUUID().toString() + suffix;
        System.out.println(newfFileName);

        try {
            file.transferTo(new File(folder, newfFileName));
            String url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/imgCovers" + format + newfFileName;

            result.setFlag(true);
            result.setMsg("上传图片成功！");
            result.setData(url);
        } catch (IOException e) {
            result.setFlag(false);
            result.setData("error");
            result.setMsg(e.getMessage());
        }
        return result;
    }
```

#### ③ 封装成工具类

~~~java
// com.kurumi.utils.FileUtils
public class FileUtils {

    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("/yyyy/MM/dd/");

    public static String uploadSimpleFile(MultipartFile file, HttpServletRequest request, String storageFolder) throws IOException {
        // 获取文件在服务器的存储位置 当前：../webapp/
        String realPath = request.getSession().getServletContext().getRealPath("/");
        // realPath = realPath.replace("target\\video_website_spring-1.0-SNAPSHOT", "src" + File.separator + "main" + File.separator + "webapp");
        System.out.println("webapp====>" + realPath);
        String originalName = file.getOriginalFilename();
        String format = simpleDateFormat.format(new Date());
        String storagePath = realPath + storageFolder + File.separator + format;

        File folder = new File(storagePath);
        if(!folder.exists()) {
            folder.mkdirs();
        }
        System.out.println(storagePath);

        // 获取文件后缀名
        String suffix = originalName.substring(originalName.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + suffix;
        System.out.println(newFileName);

        file.transferTo(new File(folder, newFileName));
        String url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/" + storageFolder + format + newFileName;
        return url;
    }
}
~~~

~~~java
// controller层
@PostMapping
public ResObj uploadVideo(MultipartFile file, HttpServletRequest request) {
    ResObj result = new ResObj();
    try {
        String url = FileUtils.uploadSimpleFile(file, request, "videos");
        result.setFlag(true);
        result.setMsg("上传视频成功!");
        result.setData(url);
    } catch(IOException e) {
        result.setFlag(false);
        result.setMsg("error");
        result.setData(e.getMessage());
    }
    return result;
}
~~~

#### ④ 注意点

> 前端上传文件的<input>输入框的**name属性名(或者是传过来文件file的键名)**要与后端接受参数中**MultipartFile的形参名**要保持一致。
>
> 即: 	<input type="file" name="fileName"/> 中的name
>
> 或:	axios.post('url', { 'fileName': file }) 中的 'fileName'

### 2. jwt 实现登录校验

~~~
JSON Web Token，通过数字签名的方式，以JSON对象为载体，在不同的服务终端之间安全的传输信息。
JWT最常见的场景就是授权认证，一旦用户登录，后续每个请求都将包含JWT，系统在每次处理用户请求的之前，都要先进行JWT安全校验，通过之后再进行处理。
~~~

* jwt 的组成

> jwt 由三部分组成，用 . 拼接

![image-20220406152111375](README.assets/image-20220406152111375.png)

![image-20220406152118876](README.assets/image-20220406152118876.png)

#### ① jwt 的基本使用

* 导入坐标

```xml
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt</artifactId>
  <version>0.9.1</version>
</dependency>
```

* 加密

```java
@Test
public void jwtEncode() {
    JwtBuilder jwtBuilder = Jwts.builder();
    String jwtToken = jwtBuilder
            // header
            .setHeaderParam("type", "JWT")
            .setHeaderParam("alg", "HS256")
            // payload
            .claim("username", "tom")
            .claim("role", "admin")
            .setSubject("admin-test")
            .setExpiration(new Date(System.currentTimeMillis() + time))
            .setId(UUID.randomUUID().toString())
            // signature
            .signWith(SignatureAlgorithm.HS256, signature)
            .compact();
    System.out.println(jwtToken);
}
```

* 解密

```java
@Test
public void jwtDecode() {
    String token = "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VybmFtZSI6InRvbSIsInJvbGUiOiJhZG1pbiIsInN1YiI6ImFkbWluLXRlc3QiLCJleHAiOjE2NDkzMTc1NDQsImp0aSI6IjNlZWJhNzRjLWFhMTYtNGU3My1iNDQ3LWU4MDQ0MTQ0NWQyNSJ9.RRwNLP76FZCjXjSzedAAy6gOT26bDkZlr-FsTq3MPJg";
    JwtParser jwtParser = Jwts.parser();
    Jws<Claims> claimsJws = jwtParser.setSigningKey(signature).parseClaimsJws(token);
    Claims claims = claimsJws.getBody();

    System.out.println(claims.get("username"));
    System.out.println(claims.get("role"));
    System.out.println(claims.getId());
    System.out.println(claims.getSubject());
    System.out.println(claims.getExpiration());
}
```

#### ② 前后端分离实现

* Login.vue

~~~vue
<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <el-form :model="loginForm" status-icon ref="ruleForm" class="login-form">
      <el-form-item>
        <span class="login-label">用户登录</span>
      </el-form-item>
      <el-form-item>
        <el-input type="username" v-model.trim="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model.trim="loginForm.password" autocomplete="off" placeholder="请输入密码">
          <template slot="append">
            <a class="forget-pass">忘记密码?</a>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="btn-box">
        <el-button type="primary" @click="$router.push('/register')" class="register-btn">注册</el-button>
        <el-button type="primary" @click="submitForm" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { loginUser } from '@/api/user.js'

export default {
  name: 'login-vue',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async submitForm(loginData) {
      // 登录业务
      const { data: res } = await loginUser(this.loginForm)
      if (res.flag && res.data) {
        this.$message.success(res.msg)
        console.log(res)
        localStorage.setItem('token', res.data.token)
        this.$router.push('/')
      }
    }
  }
}
</script>
...
~~~

* JwtUtils

```java
// com.kurumi.utils.JwtUtils
public class JwtUtils {

    private static String signature = "kurumi";
    private static long time = 1000 * 60 * 60 * 24;

    public static String createToken() {
        JwtBuilder jwtBuilder = Jwts.builder();
        String jwtToken = jwtBuilder
                // header
                .setHeaderParam("type", "JWT")
                .setHeaderParam("alg", "HS256")
                // payload
//                .claim("username", "tom")
//                .claim("role", "admin")
//                .setSubject("admin-test")
                .setExpiration(new Date(System.currentTimeMillis() + time))
                .setId(UUID.randomUUID().toString())
                // signature
                .signWith(SignatureAlgorithm.HS256, signature)
                .compact();
        return jwtToken;
    }

    public static boolean validateJwt(String token) {
        if(token == null) return false;
        JwtParser jwtParser = Jwts.parser();
        try {
            Jws<Claims> claimsJws = jwtParser.setSigningKey(signature).parseClaimsJws(token);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
```

* Jwt

```java
// com.kurumi.domain.Jwt
@Data
public class Jwt {
    // 用户登录时生成的token
    private String token;
}
```

* UserController

~~~java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    ...

    @PostMapping("/login")
    public ResObj login(@RequestBody User user) {
        boolean result = userService.login(user);
        String token = null;
        Jwt jwt = new Jwt();
        if(result) {
            token = JwtUtils.createToken();
            jwt.setToken(token);
        }
        return new ResObj(true, result?"用户登录成功！":"用户登录失败，请重新登录！", jwt);
    }

    @PostMapping("/validate")
    public ResObj login(@RequestBody String token) {
        System.out.println(token);
        boolean result = JwtUtils.validateJwt(token);
        return new ResObj(true, result?"token校验成功！":"token校验失败！", result);
    }

}
~~~

* router

~~~java
// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

...

import { validateToken } from '@/api/user.js'

Vue.use(VueRouter)

...

router.beforeEach(async(to, from, next) => {
  const pathArr = ['/videos']
  if (pathArr.indexOf(to.path) !== -1) {
    const token = localStorage.getItem('token')
    if (token) {
      const { data: res } = await validateToken(token)
      if (res.data && res.flag) {
        next()
      } else {
        next('/login')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
~~~

### 3. mybatis在update中使用动态sql

```xml
// com\kurumi\mapper\UserMapper.xml
<update id="updateUser" parameterType="user">
    update tbl_user
    <set>
        <if test="username != null">
            username=#{username},
        </if>
        <if test="password != null">
            password=#{password},
        </if>
        <if test="avatar != null">
            avatar=#{avatar},
        </if>
        <if test="intro != null">
            intro=#{intro},
        </if>
        <if test="sex != null">
            sex=#{sex}
        </if>
    </set>
    where id = #{id}
</update>
```

> 问题：update 更新成功，但返回值为null
>
> 解决：发现复制粘贴的时候没有将<select id="" ...></select>改为<update id="" ...></update>

### 4. springmvc 发送邮箱验证码(QQ邮箱)

① 导入依赖

```xml
<!--邮箱-->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context-support</artifactId>
  <version>5.0.5.RELEASE</version>
</dependency>
<dependency>
  <groupId>javax.mail</groupId>
  <artifactId>mail</artifactId>
  <version>1.4.7</version>
</dependency>
```

② 开启邮箱SMTP服务

* 打开 qq 邮箱，设置-----账户-----开启SMTP服务(往下翻)

![image-20220415213605500](README.assets/image-20220415213605500.png)

![image-20220415213941565](README.assets/image-20220415213941565.png)

③ 编写 mail.properties 文件(写入javax.mail所需要的一些参数)

```properties
#服务器主机名
#用的是qq邮箱，所以是smtp.qq.com
mail.smtp.host=smtp.qq.com
mail.smtp.port=25
#开启smtp的qq邮箱
mail.smtp.username=1305641730@qq.com
#客户端授权码(上面开启smtp服务后----生成授权码)
mail.smtp.password=kodcjsvcflmwjiee
#编码字符
mail.smtp.defaultEncoding=utf-8
#是否进行用户名密码校验
mail.smtp.auth=true
#设置超时时间
mail.smtp.timeout=20000
```

④ 往spring配置文件中编写 JavaMailSender bean对象

```xml
// applicationContext.xml
<!--加载多个.properties时要加上：ignore-unresolvable="true" 否则报错-->
<!--加载jdbc.properties-->
<context:property-placeholder location="classpath:jdbc.properties, classpath:mail.properties" ignore-unresolvable="true"/>

<!--配置邮件接口-->
<bean id="javaMailSender" class="org.springframework.mail.javamail.JavaMailSenderImpl">
    <property name="host" value="${mail.smtp.host}"/>
    <property name="port" value="${mail.smtp.port}"/>
    <property name="username" value="${mail.smtp.username}"/>
    <property name="password" value="${mail.smtp.password}"/>
    <property name="defaultEncoding" value="${mail.smtp.defaultEncoding}"/>
    <property name="javaMailProperties">
        <props>
            <prop key="mail.smtp.auth">${mail.smtp.auth}</prop>
            <prop key="mail.smtp.timeout">${mail.smtp.timeout}</prop>
        </props>
    </property>
</bean>
```

⑤ 在Controller中发送邮件并保存验证码

```java
// com.kurumi.controller.UserController
@Autowired
private JavaMailSender javaMailSender;

@Value("${mail.smtp.username}")
private String emailSender;

// username 作为 服务器session保存验证码的键值，email是要发送的邮箱地址
@PostMapping("/sendcode")
public ResObj sendCode(@RequestParam String username, @RequestParam String email, HttpSession session, HttpServletRequest request) {
    try {
        // 生成6为验证码
        String Captcha = String.valueOf(new Random().nextInt(899999) + 100000);
        System.out.println(username + "," + Captcha + "," + emailSender);
        request.getSession().setAttribute(username, Captcha);

        SimpleMailMessage message = new SimpleMailMessage();
        // 发送人邮件地址
        message.setFrom(emailSender);
        message.setTo(emailReceiver);
        message.setSubject("验证码");
        message.setText("接收到的验证码为：" + Captcha);
        javaMailSender.send(message);
        return new ResObj(true, "验证码发送成功，请注意查看邮箱！", true);
    } catch (Exception e) {
        return new ResObj(true, "验证码发送失败，请稍后再试！", false);
    }
}
```

封装成工具类后再使用：

~~~java
public class MailUtils {

    public static void generateMailCode(JavaMailSender javaMailSender, String username, String emailReceiver, String emailSender, HttpServletRequest request) {
        // 生成6为验证码
        String Captcha = String.valueOf(new Random().nextInt(899999) + 100000);
        System.out.println(username + "," + Captcha + "," + emailSender);
        request.getSession().setAttribute(username, Captcha);
//        System.out.println("session===" + request.getSession().getAttribute(username) + ",sessionID=" + request.getSession().getId());
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // 发送人邮件地址
            message.setFrom(emailSender);
            message.setTo(emailReceiver);
            message.setSubject("验证码");
            message.setText("接收到的验证码为：" + Captcha);
            javaMailSender.send(message);
        } catch (Exception e) {
            throw e;
        }
    }
}
~~~

```java
// controller层
@PostMapping("/sendcode")
public ResObj sendCode(@RequestParam String username, @RequestParam String email, HttpSession session, HttpServletRequest request) {
    try {
        MailUtils.generateMailCode(javaMailSender, username, email, emailSender, request);
        return new ResObj(true, "验证码发送成功，请注意查看邮箱！", true);
    } catch (Exception e) {
        return new ResObj(true, "验证码发送失败，请稍后再试！", false);
    }
}
```

> 注意： 
>
> ​	我的springmvc，springmvc的配置文件只扫描controller层，而spring配置文件扫描除controller以外的包，所以要想在controller中使用@Value注入mail.properties中的属性，则需要在springmvc的配置文件中加载mail.properties。
>
> ​	或者不采用注入的方式，直接将mail.properties中mail.smtp.username对应的值写在controller中。
>
> ```xml
> // spring-mvc.xml
> <context:property-placeholder location="classpath:mail.properties"/>
> ```

⑥ 采用 ajax(或者axios) 进行异步请求 springmvc 来发送邮箱验证码所产生的问题

> 如果没有采用前后端分离，则无需考虑以下问题

> 由于后台springmvc采用session会话保存验证码，以便前台拿到验证码后又发送过来效验，但是由于使用axios异步请求后端，此时后台的sessionid并不会返回给前端，前端每次请求也不会携带sessionid，这样就导致前台第二次发送键值来后台时，后台session用这个键值取出的数据就为null。

~~~
session会话知识补充：
	网络请求每次请求的request对象中都拥有session域，每次前端请求，后端都能够通过HttpServletRequest.getSession()来获取此次的session，然后会自动将这个session的jsessionid写入HttpServletResponse的response对象中，从而前台的请求头中Response Headers中就有此次会话的jsessionid，此后前台请求头的Request Headers中就会带有拥有该jsessionid的cookie，此时每次前端请求后台都是同一个session，后台不同controller中也能取到session中的值。
~~~

![image-20220415221139085](README.assets/image-20220415221139085.png)

~~~
	但是由于前后端分离，前台不会携带cookie，后台也不会往前端Headers中设置jsessionid。所以在前端的axios或者ajax中加上withCredentials = true,后台的response对象要将Access-Control-Allow-Credentials设置为true。
	但是实际测试并无作用(我使用的是vue2(2.6.14)+springmvc)
~~~

实际解决：

参考：https://blog.csdn.net/Charonmomo/article/details/122818540

​			https://blog.csdn.net/weixin_44441196/article/details/115398563?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-3.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-3.pc_relevant_aa&utm_relevant_index=6

① 前端 vue

~~~javascript
// axios.js
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
axios.defaults.withCredentials = true

export default axios
~~~

~~~javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '127.0.0.1',
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', 
        changeOrigin: true, // 接口跨域
        ws: true,
        pathRewrite: {
          '^/api': 'http://127.0.0.1:8081' // 要rewrite的，意思是将
http://127.0.0.1:8080(服务器) 重写为  http://127.0.0.1:8081(本地) 因为后台允许保存jsessionid的域名是本地       
        }
      }
    }
  }
})
~~~

> 注意：这里的127.0.0.1:8081和下面springmvc中的Access-Control-Allow-Origin中的127.0.0.1:8081不能写为localhost:8081，不然无效，(待解决)

![image-20220415222408400](README.assets/image-20220415222408400.png)

② 后台 springmvc 配置跨域和允许携带cookie

```java
// com.kurumi.filter.CORSFilter
public class CORSFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8081");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // 允许携带cookie
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
```

```xml
// web.xml
<!--CORS Filter-->
<filter>
    <filter-name>CORSFilter</filter-name>
    <filter-class>com.kurumi.filter.CORSFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CORSFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 5. mybatis 执行多条 SQL

~~~
首先在数据库连接URL上加上allowMultiQueries=true,默认mysql是不支持一次执行多条SQL语句的。
~~~

~~~~
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/video_db?allowMultiQueries=true
jdbc.username=root
jdbc.password=root
~~~~

```xml
// mapper.xml
<delete id="deleteVideoById" parameterType="int">
    delete from tbl_comment where videoId = #{id};
    delete from tbl_video where id = #{id}
</delete>
```

### 6. SpringMVC+FFmpeg制作视频封面

* 下载安装FFmpeg

> 网址： http://www.ffmpeg.org/download.html

![image-20220418160648203](README.assets/image-20220418160648203.png)

![image-20220418160744968](README.assets/image-20220418160744968.png)

> 下载后解压，然后配置环境变量。

![image-20220418160954611](README.assets/image-20220418160954611.png)

* 视频(文件)上传工具类

~~~java
public class FileUtils {

    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("/yyyy/MM/dd/");

    public static String uploadSimpleFile(MultipartFile file, HttpServletRequest request, String storageFolder) throws IOException {
        // 获取文件在服务器的存储位置 当前：../target/video_website_spring-1.0-NAPSHOT/
        String realPath = request.getSession().getServletContext().getRealPath("/");
        // realPath = realPath.replace("target\\video_website_spring-1.0-SNAPSHOT", "src" + File.separator + "main" + File.separator + "webapp");
        // System.out.println("webapp====>" + realPath);
        String originalName = file.getOriginalFilename();
        String format = simpleDateFormat.format(new Date());
        String storagePath = realPath + storageFolder + format;

        File folder = new File(storagePath);
        if(!folder.exists()) {
            folder.mkdirs();
        }
        System.out.println(storagePath);

        // 获取文件后缀名
        String suffix = originalName.substring(originalName.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + suffix;
        System.out.println(newFileName);
        file.transferTo(new File(folder, newFileName));

        String url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/" + storageFolder + format + newFileName;
        return url;
    }
}
~~~

* 视频封面生成工具类

~~~java
public class FFmpegVideo {

    // 设置了环境变量直接用ffmpeg即可
    public static final String FFMPEG_PATH = "C:\\softwares\\ffmpeg-5.0.1-full_build\\bin\\ffmpeg.exe";
    // 生成的视频封面路径(浏览器)
    public static String VideoCoverResPath = null;

    // 测试
    public static void main(String[] ars){
        final String convertFile="C:\\study\\video_website_master\\video_website_spring\\target\\video_website_spring-1.0-SNAPSHOT\\videos\\2022\\04\\18\\699055d6-b8ed-461d-bce3-3cfdbfe10e13.mp4";
        videoCatchImg(convertFile,FFMPEG_PATH);
    }

    /**
     * 截取视频图片
     * @param videoPath
     * @param ffmpegPath
     * @return
     */
    public static int videoCatchImg(String videoPath, String ffmpegPath) {
        File file = new File(videoPath);
        if (!file.exists()) {
            System.err.println("路径[" + videoPath + "]对应的视频文件不存在!");
            return -1;
        }
        List<String> commands = new java.util.ArrayList<String>();
        commands.add(ffmpegPath);
        //输入文件
        commands.add("-i");
        commands.add(videoPath);
        //输出文件若存在可以覆盖
        commands.add("-y");
        //指定图片编码格式
        commands.add("-f");
        commands.add("image2");
        //设置截取视频第3秒时的画面
        commands.add("-ss");
        commands.add("3");
        //截取的图片的存储路径
        String coverPath = videoPath.substring(0, videoPath.lastIndexOf(".")) + "_cover.jpg";
        commands.add(coverPath);
        System.out.println("commands:"+commands);
        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.redirectErrorStream(true); // //将错误流中的数据合并到输入流
            builder.command(commands);
            Process process = builder.start();

            InputStream inputStream = process.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String s = null;
            while((s = reader.readLine()) != null) {
                System.out.println(s);
            }

            int status = process.waitFor();
            // System.out.println("status=======" + status);
            return status;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public static String getFFmpegPath(String videoUrl) {
        return videoUrl.substring(0, videoUrl.lastIndexOf(".")) + "_cover.jpg";
    }
}
~~~

* controller层调用

```java
@PostMapping("/info")
public ResObj uploadVideoInfo(@RequestBody Video video, HttpServletRequest request) {
    // // 如果用户没有上传封面则生成封面
    if(video.getVideoCoverUrl() == null || video.getVideoCoverUrl().equals("")) {
        String realPath = request.getSession().getServletContext().getRealPath("/");
        String serverAdd = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String VideoPath = video.getVideoUrl().replace(serverAdd, realPath);
        System.out.println("VideoPath" + VideoPath);
        int status = FFmpegVideo.videoCatchImg(VideoPath, FFmpegVideo.FFMPEG_PATH);
        if(status != -1) {
            video.setVideoCoverUrl(FFmpegVideo.getFFmpegPath(video.getVideoUrl()));
        }
    }
    boolean result = videoService.saveVideo(video);
    return new ResObj(true, result? "视频上传成功！": "上传视频失败，请重新上传！", result);
}
```

## 前端的一些留下的问题

### 1. cookie， session

### 2. java mail
