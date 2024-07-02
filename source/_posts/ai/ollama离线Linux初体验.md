---
title: ollama离线Linux初体验
date: 2024-07-02 14:00
tag:
- llm
categories:
- AI
---
在无法访问huggingface或公网的Linux环境下，使用ollama，搭配qwen模型体验问答能力。
<!--more-->

## 安装ollama

根据官网教程 [Linux手动安装](https://github.com/ollama/ollama/blob/main/docs/linux.md)

### Download the `ollama` binary

Ollama is distributed as a self-contained binary. Download it to a directory in your PATH:

```bash
# 可以浏览器下载，然后mobaxterm等上传到linux机器
sudo curl -L https://ollama.com/download/ollama-linux-amd64 -o /usr/bin/ollama
sudo chmod +x /usr/bin/ollama
```

### Adding Ollama as a startup service (recommended)

Create a user for Ollama:

```bash
sudo useradd -r -s /bin/false -m -d /usr/share/ollama ollama
```

Create a service file in `/etc/systemd/system/ollama.service`:

```ini
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
```

Then start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
```

### Install CUDA drivers (optional – for Nvidia GPUs) 可选步骤

[Download and install](https://developer.nvidia.com/cuda-downloads) CUDA.

Verify that the drivers are installed by running the following command, which should print details about your GPU:

```bash
nvidia-smi
```
### Start Ollama

Start Ollama using `systemd`:

```bash
sudo systemctl start ollama
```
## 配置ollama

```bash
# 1. 配置ollama特有的变量OLLAMA_MODELS记录模型库存储位置，并将其写入环境变量。
mkdir /root/ollama/models
export OLLAMA_MODELS=/root/ollama/models
# 2. 启动守护进程
ollama serve
# 3. 下载模型，找到uugf后缀的模型，规格根据机器配置选择
cd /root/ollama/models
wget https://huggingface.co/Qwen/Qwen2-0.5B-Instruct-GGUF/resolve/main/qwen2-0_5b-instruct-q8_0.gguf?download=true
# 制作Modelfile.txt文件，该文件和模型文件在同一层目录。
cat > Modelfile.txt <<EOF
FROM ./qwen2-0_5b-instruct-q8_0.gguf

# 以下命令参考ollama官网针对千问的示例
TEMPLATE """{{ if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}{{ if .Prompt }}<|im_start|>user
{{ .Prompt }}<|im_end|>
{{ end }}<|im_start|>assistant
{{ .Response }}<|im_end|>
"""

PARAMETER stop "<|im_start|>"
PARAMETER stop "<|im_end|>"

EOF
# 4. 启动模型
ollama create qwen0.5b -f Modelfile.txt
# 5. 运行模型
ollama run qwen0.5b
# 6. 退出
/bye

```


## 运行结果

```bash
root@ubuntu:/tmp# ollama run qwen0.5b
>>> 以李白的风格写一首七言绝句
月照孤舟客，灯烧古道人。

心随流水逝，梦入仙宫迷。

>>> /bye

```