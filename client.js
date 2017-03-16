const net = require('net');
const util = require('util');
const rc = require('reconnect-net');

let clientId = process.argv[2] || 'client1';
let channelId = process.argv[3] || 'channel1';
let host = process.argv[4] || '0.0.0.0';
let port = process.argv[5] || 8124;

let client;


rc(function(_client){
    client = _client;
    util.log('...reconnected');
    _client.write(clientId + ':' + channelId);


    let intervalId = setInterval(() => {
        _client.write(Date.now().toString()+'\n');
    }, 10000);

    _client.on('close', () => {
        clearInterval(intervalId);
    });

    _client.on('data', (data) => {

        util.log(data.toString());
        // client.end();
    });
}).connect(port,host);


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
