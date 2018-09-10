---
title: vscode配置for VUE
date: 2018-07-15
tags:
- VUE
- 前端
categories:
- 开发VUE
---
测试开发要做点什么东东,几乎就是全栈的节奏了, 记录一下vscode的一些配置
<!--more-->
```json
{
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
    "javascript.implicitProjectConfig.checkJs": true,
    "javascript.validate.enable": false,
    "prettier.singleQuote": true,
    "prettier.semi": false,
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
            "language": "vue",
            "autoFix": true
        }
    ]
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzODYwMzk0NTldfQ==
-->