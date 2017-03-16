/**
 * junctor 服务端
 */
const net = require('net');
const guid = require('guid');
const util = require('util');

// 缓存所有连接对象
let sockets = new Set();

function clientEventLog(eventDescription, client){
    util.log(`[${eventDescription}]: ${client.guid} : ${client.clientId} : ${client.channelId}`);
}

const server = net.createServer((socket) => {


    socket.on('data', (buffer) => {

        // 判断是否首次连接，因为要获得客户端发送过来的信息，
        // 所以放在 onData 事件中，而不是放在 createServer 
        // 的回调函数中
        if (sockets.has(socket)) {
            util.log('from client: ' + socket.guid + ' : ' + socket.clientId + ' : ' + socket.channelId + ' : ' + buffer.toString());

            // 已存在，则做转发工作
            sockets.forEach((_socket) => {
                if (_socket !== socket && _socket.channelId === socket.channelId && _socket.clientId !== socket.clientId) {

                    util.log('转发 ' + socket.clientId + ' > ' + _socket.clientId + ' ' + buffer);
                    _socket.write(buffer);
                }
            });
        } else {
            // 首次连接，加入连接对象
            let ids = buffer.toString().split(':');
            socket.clientId = ids[0];
            socket.channelId = ids[1];
            socket.guid = guid.raw();

            sockets.add(socket);
            util.log(sockets.size);

            clientEventLog('client joined', socket);

        }


    });

    // 设置超时，客户端无响应 1分钟 自动销毁
    socket.setTimeout(60000,()=>{
        sockets.delete(socket);
        socket.destroy();
        clientEventLog('client timeout', socket);

    });

    socket.on('end', () => {
        // 断开连接则删除连接对象
        sockets.delete(socket);
        clientEventLog('client left', socket);

    });

    socket.on('error',()=>{
        socket.destroy();
        clientEventLog('client destroyed', sockets);

    });

}).on('error', (err) => {
    throw err;
});

process.on('uncaughtException', function(err) {
    util.log(err);
});

server.listen(8124, () => {
    util.log('opened server on', server.address());
});
