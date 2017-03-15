# Junctor

网络对接器，用来解决无法直接连接内网的服务问题。

## 转发逻辑

1. 自己不会发给自己
2. 不会转发给相同的 clientId
3. 只转发给相同的 channelId


## 测试

启动服务： `node .`

启动客户端： `node client.js clientId channelId`

