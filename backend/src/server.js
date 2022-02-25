const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true,
	},
});

const connectUsers = {};

io.on('connection', socket => {
	const { user } = socket.handshake.query;

	//console.log(user, socket.id);
	connectUsers[user] = socket.id;
});

mongoose.connect(
	'mongodb+srv://leopl:leon0021@cluster0.scepg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
	}
);

app.use((req, res, next) => {
	req.io = io;
	req.connectUsers = connectUsers;

	return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
