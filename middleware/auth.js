/**
 * Middleware qui va authentifier les requêtes et transmettre
 * les infos aux gestionnaires de routes.
 * On commence par importer jsonwebtoken avec require.
 * Puis on exporte le middleware qui va essayer :
 *  d' extraire le token du header 'Authorization' de la requête
 *  entrante qui contiendra également le mot-clé 'Bearer'.
 *  On utilise donc la fonction split() pour tout récupérer
 *  après l'espace dans le header.
 *  On utilise ensuite la fonction verify pour décoder le
 *  token.
 *  On extrait l'ID utilisateur du token et on le rajoute à
 *  l’objet Request afin que les différentes routes puissent
 *  l’exploiter.
 */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		// La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token :
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
		const userId = decodedToken.userId;
		req.auth = {
			userId: userId,
		};
		next();
	} catch (error) {
		res.status(401).json({ error });
	}
};

/**
 * Il faut ensuite appliquer ce middleware aux routes sauces,
 * qui sont celles à protéger.
 * Dans le routeur sauces, on importe ce middleware.
 */
