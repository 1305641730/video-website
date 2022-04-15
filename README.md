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
        isExist: false,
        isBtnSend: false,
        btnSendInfo: '发送邮箱验证码',
        timer: null,
        ...
	}
}
methods: {
	sendEmail() {
		...
		// 倒计时30秒之后才能再次发送验证码
        this.isBtnSend = true
        let count = 30
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (count === 0) {
              this.btnSendInfo = '发送邮箱验证码'
              this.isBtnSend = false
              this.timer = null
            } else {
              count--
              this.btnSendInfo = count + '秒后重试'
            }
          }, 1000)
        }
        ...
	}
}
</script>
~~~

## 前端的一些留下的问题

### 1. vue 中 proxy 的作用

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

### 4. springmvc 发送邮箱验证码

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

② 

## 前端的一些留下的问题

### 1. cookie， session

### 2. java mail
