### 1. 部署Tailscale

tun(synology)

```shell
#install
(lsmod | grep tun || \
{ insmod /lib/modules/tun.ko; mknod /dev/net/tun c 10 200; chmod 600 /dev/net/tun; } \
) >/dev/null 2>&1

#enable
cat < /usr/local/etc/rc.d/tun.sh
#!/bin/sh -e
insmod /lib/modules/tun.ko
EOF
```

docker-compose

```yaml
version: '3.3'
services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: Tailscale
    network_mode: host
    privileged: true
    cap_add:
      - net_admin
      - sys_module
    volumes:
      - /var/run/tailscale:/var/run/tailscale
      - /dev/net/tun:/dev/net/tun
      - /etc/rc
      - ./tailscale:/var/lib/tailscale
    command: sh -c "ln -sf /tmp/tailscaled.sock /var/run/tailscale/tailscaled.sock && tailscaled"
    restart: unless-stopped
```

注册到服务器

```shell
tailscale up --advertise-routes=<node-subnet> [--accept-routes]
```

### 2. 在服务器上部署Derper

[参考文档](https://tailscale.com/kb/1118/custom-derp-servers/)

访问derp服务出现页面代表部署成功

```yaml
version: "3"
services:
  derper:
    container_name: derper
    image: fredliang/derper
    volumes:
      - /root/cert:/cert
    ports:
      - 3478:3478/udp
      - 23479:23479
    environment:
      DERP_DOMAIN: <hostname> #需要有解析及证书支持
      DERP_ADDR: ":23479"
      DERP_CERT_MODE: manual
      DERP_CERT_DIR: /cert
    restart: unless-stopped
```

### 3. 部署Headscale（可选）

#### 部署服务

基本准备

```shell
#数据准备
mkdir -p ./headscale/config
wget -O ./headscale/config/config.yaml https://raw.githubusercontent.com/juanfont/headscale/main/config-example.yaml
touch ./headscale/config/db.sqlite

#修改配置文件
server_url: http://<hostname|ip>:8080 #填写hostname则需要解析到ip，客户端即可用hostname或ip连接server_url
#可以使用nginx反向代理 https://headscale.net/reverse-proxy/
metrics_listen_addr: 0.0.0.0:9090 #metrics端口，可以不暴露
private_key_path: /etc/headscale/private.key #修改为映射目录
noise:
  private_key_path: /etc/headscale/noise_private.key #修改为映射目录
db_type: sqlite3
db_path: /etc/headscale/db.sqlite #修改为映射目录
```

docker-compose

```yaml
version: "3"
services:
  headscale:
    container_name: Headscale
    volumes:
      - ./config:/etc/headscale/
    ports:
      - 8080:8080
      #- 9090:9090
    image: headscale/headscale:latest
    command: headscale serve
    restart: unless-stopped
```

#### 组建网络

在headscale上创建名称空间（仅名称空间内注册节点可互相连接，具有隔离性）
`headscale namespaces create <namespace>`

注册到Headscale

```shell
#client
#注册页面复制命令到headscale执行
#linux，docker或本地部署，使用以下命令打开注册页面
tailscale up --login-server=http://<server_url> --advertise-routes=<node-subnet> --accept-dns=false
tailscale up --login-server=http://<server_url> --accept-routes=false --accept-dns=false
#windows
tailscale login --login-server=http://<server_url> --accept-dns=false

#在headscale启用node-subnet
headscale routes list
headscale routes enable -r <route-id>
```
