---
title: Springboot使用maven打包分离lib与config
date: 2025-05-02 00:13:06
categories: 代码
---

## 当前运行环境

- jdk-17.0.10
- spring-boot-starter-parent-3.4.4
- lombok
- mybatis-flex 

## 修改 spring-boot-maven-plugin

> 编译出不带 lib 文件夹的Jar包

```xml
<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
		<fork>true</fork>
		<includeSystemScope>true</includeSystemScope>
		<includes>
      <!-- 不包含任何东西 -->
			<include>
				<groupId>no</groupId>
				<artifactId>no</artifactId>
			</include>
		</includes>
		<excludes>
      <!-- 排除 lombok 保证其正确加载 -->
			<exclude>
				<groupId>org.projectlombok</groupId>
				<artifactId>lombok</artifactId>
			</exclude>
		</excludes>
	</configuration>
	<executions>
		<execution>
			<goals>
				<goal>repackage</goal>
			</goals>
		</execution>
	</executions>
</plugin>
```


## 修改 maven-compiler-plugin

> 完成对Java代码的编译

```xml
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-compiler-plugin</artifactId>
	<configuration>
    <!-- 源代码 JDK版本 --> 
		<source>${java.version}</source>
    <!-- 编译后 JDK版本 -->
		<target>${java.version}</target>
		<encoding>UTF-8</encoding>
		<compilerArguments>
			<verbose/>
			<bootclasspath>${java.home}/lib/rt.jar:${java.home}/lib/jce.jar</bootclasspath>
		</compilerArguments>
		<annotationProcessorPaths>
			<path>
				<groupId>org.projectlombok</groupId>
				<artifactId>lombok</artifactId>
			</path>
			<path>
				<groupId>com.mybatis-flex</groupId>
				<artifactId>mybatis-flex-processor</artifactId>
				<version>1.10.9</version>
			</path>
		</annotationProcessorPaths>
	</configuration>
</plugin>
```


## 修改 maven-dependency-plugin

> 复制依赖库 `.jar` 文件至 `lib` 文件夹

```xml
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-dependency-plugin</artifactId>
	<executions>
		<execution>
			<id>copy-dependencies</id>
			<phase>prepare-package</phase>
			<goals>
				<goal>copy-dependencies</goal>
			</goals>
			<configuration>
				<outputDirectory>${project.build.directory}/lib</outputDirectory>
				<overWriteReleases>false</overWriteReleases>
				<overWriteSnapshots>false</overWriteSnapshots>
				<overWriteIfNewer>true</overWriteIfNewer>
			</configuration>
		</execution>
	</executions>
</plugin>
```


## 修改 maven-resources-plugin

> 复制 `resources` 至 `config` 文件夹

```xml
<plugin>
	<artifactId>maven-resources-plugin</artifactId>
	<executions>
		<execution>
			<id>copy-dependencies</id>
			<phase>package</phase>
			<goals>
				<goal>copy-resources</goal>
			</goals>
			<configuration>
				<!-- 资源文件输出目录 -->
				<outputDirectory>${project.build.directory}/config</outputDirectory>
				<resources>
					<resource>
						<directory>src/main/resources</directory>
					</resource>
				</resources>
			</configuration>
		</execution>
	</executions>
</plugin>
```



## 修改 maven-jar-plugin

> 指定启动类，指定配置文件，将依赖打成外部jar包

```xml
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-jar-plugin</artifactId>
	<configuration>
		<archive>
			<manifest>
				<addClasspath>true</addClasspath>
				<classpathPrefix>lib/</classpathPrefix>
        <!-- 启动类路径 -->
				<mainClass>fun.lingzhen.sso.SsoApplication</mainClass>
			</manifest>
		</archive>
		<excludes>
      <!-- 需要排除的文件类型 -->
			<exclude>*.pem</exclude>
			<exclude>*.p12</exclude>
			<exclude>*.xml</exclude>
			<exclude>*.yml</exclude>
		</excludes>
	</configuration>
</plugin>
```

