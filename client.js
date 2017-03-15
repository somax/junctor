const net = require('net');
const util = require('util');

let clientId = process.argv[2] || 'client1';
let channelId = process.argv[3] || 'channel1';

const client = net.connect({ host:'0.0.0.0', port: 8124 }, () => {
    // 'connect' listener
    util.log('connected to server!');

    client.write(clientId+':'+channelId);


    let intervalId = setInterval(() => {
        client.write(Date.now().toString()+'\n')
    }, 500);

    client.on('end', () => {
        clearInterval(intervalId);
    })


});
client.on('data', (data) => {
    util.log(data.toString());
    // client.end();
});
client.on('end', () => {
    util.log('disconnected from server');


});
