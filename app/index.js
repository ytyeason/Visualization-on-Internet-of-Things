// Root File for Node Service 
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
app.use(express.static(__dirname + '/'));
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({extended: false}));
app.use(require('webpack-hot-middleware')(webpack(webpackConfig)));
server.listen(3000);
app.get('*', (req, res) => {
    console.log('Orignal Path: ' + req.url);
    res.sendFile(__dirname + '/index.html');
});
console.log('Server Has Been Hosted On Port : 3000');
var array = [];
const maxMemorySize = 30;
io.on('connection', socket => {
    console.log('connected');
    socket.on('message', body => {
        socket.broadcast.emit('message', {body, from: socket.id.slice(8)});
    });
    socket.on('newDataPoint', body => {
        console.log('new data point received: ' + body.x + ',' + body.y);
        array.push([body.x, body.y]);
        var arrayToBoardCast = array;
        if (array.length > maxMemorySize) {
            arrayToBoardCast = array.slice(-maxMemorySize);
        }
        console.log(arrayToBoardCast);
        socket.broadcast.emit('setArray', {array: arrayToBoardCast, body})
    });

    socket.on('newBubbleDataPoint', body => {
        console.log('new bubble data point received: ' + body.x + ',' + body.y);

        socket.broadcast.emit('BubbleDataPoint', {body})
    });

    socket.on('newGridDataPoint', body => {
        console.log('new grid data point received');

        socket.broadcast.emit('newGridDataPoint', {body})
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
    });
});