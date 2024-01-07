部分CentOS系统需要升级内核

## 1. 基础环境准备

所有服务器均需进行

```shell
#配置时钟同步、禁用swap(fstab)、暂停防火墙

#配置可到达的CentOS、Docker、Kubernetes源

#基本依赖
yum install curl yum-utils device-mapper-persistent-data lvm2 glibc-langpack-zh vim wget bash-completion ipset ipvsadm

#网桥过滤及内核转发
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
EOF
#生效
sysctl -p /etc/sysctl.d/k8s.conf # modprobe br_netfilter

#ipvs所需内核模块
cat > /etc/sysconfig/modules/ipvs.module << EOF
modprobe -- ip_vs
modprobe -- ip_vs_sh
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- nf_conntrack
EOF
#生效
#modprobe -- ip_vs && modprobe -- ip_vs_sh && modprobe -- ip_vs_rr && modprobe -- ip_vs_wrr && modprobe -- nf_conntrack
chmod 755 /etc/sysconfig/modules/ipvs.module && /etc/sysconfig/modules/ipvs.module
#查看是否加载
lsmod | grep -e ip_vs -e nf_conntrack

#安装docker（根据实际情况修改daemon的镜像源、device、数据目录）
yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

#安装cri-dockerd
rpm -Uvh https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.7/cri-dockerd-0.3.7.20231027185657.170103f2-0.el7.x86_64.rpm
#修改service
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd://  --network-plugin=cni --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9 --cni-bin-dir=/opt/cni/bin --cni-cache-dir=/usr/lib/cni/cache --cni-conf-dir=/etc/cni/net.d

#安装cni插件
mkdir -p /opt/cni/bin
curl -fsSL https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz
tar zxf cni-plugins-linux-amd64-v1.3.0.tgz -C /opt/cni/bin/

#安装kube套件
yum install kube{rnetes-cni,adm,let,ctl}

#启动各套件
systemctl enable --now docker cri-docker kubelet
```

## 2. 初始化

选择一个服务器作为第一个主节点，此步骤只在此节点上进行

```shell
#打印初始化配置
kubeadm config print init-defaults > kubeadm-init.yaml
#根据环境修改
advertiseAddress: #IP
name: k8s-master-01 #主机名
controlPlaneEndpoint: ":6443" #添加行；指向k8s-master(IP|域名)
imageRepository: registry.aliyuncs.com/google_containers #阿里云镜像仓库
podSubnet: 10.95.0.0/16 #添加行；Pod子网池
serviceSubnet: #Service子网池；建议修改为10.96.0.0/16更易用
--- #IPVS模式
apiVersion: kubeproxy.config.k8s.io/v1alpha1  
kind: KubeProxyConfiguration  
mode: ipvs

#预下载镜像
kubeadm config images pull --config kubeadm-init.yaml

#初始化，保留加入节点命令
kubeadm init --config kubeadm-init.yaml

#安装网络插件flannel
curl -fsSL https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
#如果在kubeadminit中有修改podSubnet，则该配置文件需修改此行
net-conf.json |
  { 
    "Network": "10.95.0.0/16", #value更改为kubeadminit打印配置文件中podSubnet的定义
#部署flannel插件
kubectl apply -f kube-flannel.yml

#等待本节点进入Ready、kube-flannel名称空间中的kube-flannel进入Running后，初始化完成

#（可选）为其他用户设定kubectl
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## 3. 加入节点

```shell
#在主节点上准备好所需应用镜像
#导出全部镜像并复制到其他节点
docker save `docker images | awk 'NR!=1{print $1":"$2}'` | gzip - > kubernetes-img.tar.gz

#在其他节点上导入镜像
docker load -i kubernetes-img.tar.gz

#使用初始化中获得的节点加入命令来加入节点
#若加入节点命令遗失
#kubejoin=`kubeadm token create --print-join-command`; $kubejoin --cri-socket unix:///run/cri-dockerd [--control-plane]

#等待本节点进入Ready、kube-flannel名称空间中的kube-flannel进入Running后，加入完成
```

## 4. 可选修改

```shell
#kubelet数据目录修改
#service修改
sed -i.backup \
-e 's@"\(KUBELET_KUBECONFIG_ARGS\)=.*"@"\1=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf\ --kubeconfig=/etc/kubernetes/kubelet.conf --root-dir=/path/to/kubelet' \
-e 's@\/var\/lib@/path/to/kubelet@g' /lib/systemd/system/kubelet.service.d/10-kubeadm.conf
#conf修改（可选；此处只是修改证书指向，如果保留/var/lib/kubelet，则可以跳过）
sed -i.bakcup 's@\/var\/lib@/path/to/kubelet@g' /etc/kubernetes/kubelet.conf
#复制kubelet到设定的目录下
cp -a /var/lib/kubelet /path/to/
#重启kubelet
systemctl daemon-reload && systemctl restart kubelet


#etcd数据目录修改
vim /etc/kubernetes/manifests/etcd.yaml
...
  - hostPath:
      path: /path/to/etcd #仅修改此处
      type: DirectoryOrCreate
    name: etcd-data
#等待集群删除etcd，pod消失后，复制etcd到设定的目录下
cp -a /var/lib/etcd/ /path/to
#重启kubelet
systemctl daemon-reload && systemctl restart kubelet

#如果发现节点有仍继续调度pod到旧数据目录的情况，则删除那个容器或者重启物理机
```
