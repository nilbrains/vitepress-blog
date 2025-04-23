---
title: 关于 Git 的一些基础指令
date: 2022-09-21 15:08:29
categories: 代码
---

## 创建版本库

```bash
git clone <url>                         #克隆远程版本库
git init                                #初始化本地版本库
```

## 个人信息

```bash
git config user.name                    #查看用户名
git config user.email                   #查看邮箱
git config --global user.name <name>    #修改用户名
git config --global user.email <email>  #修改邮箱
```

## 修改和提交

```bash
git status                              #查看状态
git diff                                #查看变更内容
git add .                               #跟踪所有改动过的文件
git add <file>                          #跟踪指定的文件
git mv <old> <new>                      #文件改名
git rm <file>                           #删除文件
git rm --cached <file>                  #停止跟踪文件但不删除
git commit -m "msg"                     #提交所有跟踪的文件
git commit --amend                      #修改最后一次提交
```

## 查看提交历史

```bash
git log                                 #查看提交历史
git log -p <file>                       #查看指定文件的提交历史
git blame <file>                        #以列表方式查看指定文件的提交历史
```

## 撤消

```bash
git reset --hard HEAD                   #撤消工作目录中所有未提交文件的修改内容
git checkout HEAD <file>                #撤消指定的未提交文件的修改内容
git revert <Commit>                     #撤消指定的提交
```

## 分支和标签

```bash
git branch                              #显示所有的本地分支
git checkout <branch/tag>               #切换到本地分支或标签
git branch <new branch>                 #创建新分支
git branch -d <branch>                  #删除本地分支
git tag                                 #列出所有本地标签
git tag <tagname>                       #基于最新提交创建标签
git tag -d <tagname>                    #删除标签
```

## 合并与衍合

```bash
git merge <branch>                      #合并指定分支到当前分支
git rebase <branch>                     #衍合指定分支到当前分支
```

## 远程操作

```bash
git remote -v                           #查看远程版本库信息
git remote show <remote>                #查看指定远程版本库信息
git remote add <remote> <url>           #添加远程版本库
git fetch <remote>                      #从远程库获取代码
git pull <remote> <branch>              #下载代码 快速合并
git push <remote> <branch>              #上传代码 快速合并
git push <remote> :<branch / tagname>   #删除远程分支或标签
git push --tags                         #上传所有标签
```
