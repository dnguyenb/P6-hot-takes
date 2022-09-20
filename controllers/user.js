// Le package bcrpyt permet un cryptage sécurisé avec un algorithme unidirectionnel
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // On a besoin du modele 'User'
const dotenv = require('dotenv');
dotenv.config();
const cryptoJs = require('crypto-js');
const emailValidator = require('email-validator');

exports.signup = (req, res, next) => {
	const emailCrypt = cryptoJs
		.HmacSHA512(req.body.email, `${process.env.CLE_EMAIL}`)
		.toString();
	if (!emailValidator.validate(req.body.email)) {
		return res.status(403).json({ message: 'email invalide' });
	} else {
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				// Avec ce hash, enregistre un nouvel objet utilisateur :
				const user = new User({
					email: emailCrypt,
					password: hash,
				});
				user
					.save()
					.then(() => res.status(201).json({ message: 'Utilisateur créé' }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error })); // 500 erreur serveur
	}
};

exports.login = (req, res, next) => {
	const emailCrypt = cryptoJs
		.HmacSHA512(req.body.email, `${process.env.CLE_EMAIL}`)
		.toString();
	User.findOne({ email: emailCrypt }) // valeur pour filtrer
		.then((user) => {
			if (user === null) {
				// user n'existe pas
				return res
					.status(404)
					.json({ message: 'Paire identifiant / mot de passe incorrecte' });
			} else {
				// s'il existe, comparer les mots de passe :
				bcrypt
					.compare(req.body.password, user.password)
					.then((passwordValid) => {
						// si mdp non valide :
						if (!passwordValid) {
							res.status(404).json({
								message: 'Paire identifiant / mot de passe incorrecte',
							});
						} else {
							// si mdp correct, retourner l'id et le token au frontend :
							res.status(200).json({
								userId: user._id,
								token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
									expiresIn: '2h',
								}), // La méthode 'sign()' de jsonwebtoken envoie un nouveau token qui contient l'Id de l'utilisateur.
							});
						}
					})
					.catch((error) => {
						res.status(500).json({ error });
					});
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};
