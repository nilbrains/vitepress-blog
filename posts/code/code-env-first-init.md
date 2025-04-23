---
title: 一些常用的环境搭建
date: 2023-04-16 19:09:00
categories: 代码
---


一般情况下的环境, 开发工具 `IDEA` `VS Code`

<!-- more -->

## 后端服务

### Java

官网下载路径 [Java Downloads | Oracle](https://www.oracle.com/java/technologies/downloads/#java8-windows)

下载安装包 直接一路下一步 即可

**检查是否安装成功**

1. `WIN` + `R` 打开运行 输入`cmd` 回车, 会打开一个黑窗口(可能不是)
2. 在 命令行 中输入 `java -version `
3. 输出 以下类似字样 即为成功

```bash
java version "1.8.0_351"
Java(TM) SE Runtime Environment (build 1.8.0_351-b10)
Java HotSpot(TM) 64-Bit Server VM (build 25.351-b10, mixed mode)
```

### Maven

官网下载路径: [Maven – Welcome to Apache Maven](https://maven.apache.org/)

下载版本:3.8.6 (不是最新)

**将下载好的解压到自己设置的目录中（路径中不要有中文等影响环境的字符）**

1. 配置环境变量 (此电脑--->属性--->高级系统设置--->环境变量--->系统变量(S)--->新建)

```
 //此处的变量值为你存放Maven的解压路径
 变量名：MAVEN_HOME
 变量值：D:\develop\Maven\apache-maven-3.8.6

 //此处的变量值为你存放Maven的解压后目录中的文件夹的路径
 变量名：M2_HOME
 变量值：D:\develop\Maven\apache-maven-3.8.6\repository
 
 // 可执行目录
 变量名: path
 追加: %MAVEN_HOME%/bin
```

2. 配置文件 (D:\develop\Maven\apache-maven-3.8.6\conf\settings.xml)

```
// 找到 <mirrors></mirrors> 标签

<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>

// 添加本地 仓库

<localRepository>D:\develop\Maven\apache-maven-3.8.6\repository</localRepository>

```

**检查是否安装成功**

1. `WIN` + `R` 打开运行 输入`cmd` 回车, 会打开一个黑窗口(可能不是)
2. 在 命令行 中输入 `mvn -version `
3. 输出 以下类似字样 即为成功

```bash
Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: D:\develop\Maven\apache-maven-3.8.6
Java version: 1.8.0_351, vendor: Oracle Corporation, runtime: D:\develop\Java\java8\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```



## 前端服务

### Node.js

在安装`node.js`前先安装`nvm`

nvm安装: [nvm for windows 下载、安装及使用 - 掘金 (juejin.cn)](https://juejin.cn/post/7074108351524634655)

1. 打开命令行
2. `nvm install 16.18.0`
3. `nvm use 16.18.0`

### Pnpm

官网地址: [安装 | pnpm中文文档 | pnpm中文网](https://www.pnpm.cn/installation)

1. 打开命令行
2. `npm install -g pnpm`

### 微信小程序

官方地址: [https://mp.weixin.qq.com/](https://mp.weixin.qq.com/)

1. 注册一个小程序或者测试号
2. 获取 `AppID` 和 `AppSecret` (请保存)