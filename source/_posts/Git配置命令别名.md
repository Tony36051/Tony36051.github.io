---
title: Git配置命令别名
date: 2019-03-21 10:14
tags:
- git
categories:
- 小技巧
---
有时候会忘记git命令，或者手快敲错，配置别名减少记忆，减少敲错。
<!-- more -->
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIwOTgxOTc1MzldfQ==
-->