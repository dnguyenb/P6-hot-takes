/**
 * Un fichier controller exporte des méthodes qui sont ensuite
 * attribuées aux routes pour améliorer la maintenabilité
 * de l' application.
 */

// On utilise le schema 'Sauce', donc on l'importe :
const Sauce = require('../models/Sauce');
// file system (fs) donne accès aux fonctions qui permettent de modifier le système de fichiers et de supprimer les fichiers.
const fs = require('fs');

exports.createSauce = (req, res, next) => {
	// Les données entrantes sont sous la forme de form-data . Il faut donc utiliser JSON.parse() pour transformer des chaînes de caractères en JSON exploitable :
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	delete sauceObject._userId; // on utilise le userId du token
	const sauce = new Sauce({
		...sauceObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	});

	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				// si req.file existe il faut récupérer le fichier :
				...JSON.parse(req.body.thing),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		  } // s'il n'y a pas de fichier alors :
		: { ...req.body };

	delete sauceObject._userId; // supprime l'id envoyé par le client.
	Sauce.findOne({ _id: req.params.id })
		.then((thing) => {
			if (sauce.userId != req.auth.userId) {
				res.status(401).json({ message: 'Non autorisé !' });
			} else {
				Sauce.updateOne(
					{ _id: req.params.id },
					{ ...sauceObject, _id: req.params.id }
				)
					.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find() // liste complète
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error })); // 404 objet non trouvé
};

/**
 * Il faut d'abord  s'assurer que la personne qui veut supprimer
 * est bien celle qui a créé cette sauce.
 * Si l'userId de la BDD est égal à celui du token alors il faut
 * supprimer la sauce ET son image.
 */
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// vérifie si userId de la BDD == userId du token :
			if (sauce.userId != req.auth.userId) {
				res.status(401).json({ message: 'Non autorisé !' });
			} else {
				// Supprime l'objet et l'image :
				const filename = sauce.imageUrl.split('/images/')[1];
				// La méthode unlink() du package fs permet de supprimer un fichier du système de fichiers :
				fs.unlink('images/${filename}', () => {
					Sauce.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({ message: 'Sauce supprimée !' });
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
