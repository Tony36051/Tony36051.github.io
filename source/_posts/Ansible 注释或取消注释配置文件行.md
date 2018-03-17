---
title: Ansible 注释或取消注释配置文件行
tags:
- ansible

---
# Ansible 注释或取消注释配置文件行
## 简介
使用replace或lineinfile文件处理多行或单行配置文件，进行注释或解除注释

### 原始文件
```bash
cat /etc/zabbix/zabbix_agentd.conf
### Option: EnableRemoteCommands
#       Whether remote commands from Zabbix server are allowed.
#       0 - not allowed
#       1 - allowed
#
# Mandatory: no
# Default:
# EnableRemoteCommands=0
```

### 注释
```bash
cat config.yml
  - name: EnableRemoteCommands 
    lineinfile: 
      path: /etc/zabbix/zabbix_agentd.conf
      regexp: '(.*EnableRemoteCommands.*)'
      line: '#\1'
    become: yes
```

### 取消注释
```bash
cat config.yml
  - name: EnableRemoteCommands 
    lineinfile: 
      path: /etc/zabbix/zabbix_agentd.conf
      regexp: '^#(.*EnableRemoteCommands.*)'
      line: '\1'
    become: yes
```

