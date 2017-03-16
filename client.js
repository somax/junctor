/**
 * 这是用来测试连接的客户端
 * @example
 * node client.js user1 chatChannel
 */
const util = require('util');
const reconnect = require('reconnect-net');

let clientId = process.argv[2] || 'client1';
let channelId = process.argv[3] || 'channel1';
let host = process.argv[4] || '0.0.0.0';
let port = process.argv[5] || 8124;

let client;


reconnect(function(_client){
    client = _client;
    util.log('...reconnected');
    _client.write(clientId + ':' + channelId);

    // 发送心跳，保持连接
    let intervalId = setInterval(() => {
        _client.write(Date.now().toString()+'\n');
    }, 50000);

    _client.on('close', () => {
        clearInterval(intervalId);
    });

    _client.on('data', (data) => {
        util.log(data.toString());
    });
}).connect(port,host);

// 处理异常
process.on('uncaughtException', function(err) {
    util.log(err);
});

// 交互输入
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    // output: process.stdout
});

rl.on('line', (input) => {
    client.write(input);
});
