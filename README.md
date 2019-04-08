# 模版

## 页面路径

- <http://localhost:8080/static/pc/#/demo/login>  
- <http://localhost:8080/static/pc/#/demo/home>   

## 其它

## 安装依赖

```bash
- cd vue-node-mongo
- npm i
- cd vue-node-mongo/src/server
- npm i
```
## 运行前端

```bash
- cd vue-node-mongo
- npm run serve
```

## 安装mongodb
#### 照着官网安装教程或者自己百度教程手动安装完成mongodb
在安装目录下的bin文件夹下鼠标右键+shift打开命令窗口执行(两个命令行分两个窗口执行),dbpath根据不同的安装路径做修改
```
- mongod --dbpath D:\MongoDB\data\db
- mongo
```
## 运行服务器连接mongo数据库

```bash
- cd vue-node-mongo/src/server
- npm run dev
```