/* How to start the project :
Front activate > ng serve  (msg told if valid = ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **) */
/* Back activate >
User openning : npm run start (msg told id valid = server Online [port: 4200]) Developper openning : npm run dev (msg told id valid = server Online [port: 4200]) */

// Import des packages nécessaires avec la méthode 'require' :
const http = require('http'); // rajout 's' pour https si on a un certificat SSL.
const app = require('../backend/app');

/* la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne */
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// recherche, gère et enregistre les différentes erreurs dans le serveur :
const errorHandler = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// app est la fonction express qui va gérer les requêtes et réponses du serveur :
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);
