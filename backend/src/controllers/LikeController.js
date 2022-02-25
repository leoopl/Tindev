const Dev = require('../models/Dev');

module.exports = {
	async store(req, res) {
		console.log('AQUIIIIIIIIIIIII EIIIIII', req.io, req.connectUsers);

		const { user } = req.headers;
		const { devId } = req.params;

		const loggedDev = await Dev.findById(user);
		const targetDev = await Dev.findById(devId);

		if (!targetDev) {
			return res.status(400).json({ error: 'Dev not exist' });
		}

		if (targetDev.likes.includes(loggedDev._id)) {
			const loggedSocket = req.connectUsers[user];
			const targetSocket = req.connectUsers[devId];

			//TODO:  guardar as info do match em uma collection dentro do mongoDB e mostrar se logar depois do match

			if (loggedSocket) {
				req.io.to(loggedSocket).emit('match', targetDev);
			}

			if (targetSocket) {
				req.io.to(targetSocket).emit('match', loggedDev);
			}
		}

		loggedDev.likes.push(targetDev._id);

		await loggedDev.save();

		return res.json(loggedDev);
	},
};
