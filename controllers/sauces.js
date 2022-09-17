/**
 * Un fichier controller exporte des méthodes qui sont ensuite
 * attribuées aux routes pour améliorer la maintenabilité
 * de l' application.
 */

// On utilise le schema 'Sauce', donc on l'importe :
const Sauce = require('../models/Sauce');

// file system (fs) donne accès aux fonctions qui permettent de modifier le système de fichiers et de supprimer les fichiers.
const fs = require('fs');

//___________________ CREE UNE SAUCE ___________________
exports.createSauce = (req, res, next) => {
	// Les données entrantes sont sous la forme de form-data . Il faut donc utiliser JSON.parse() pour transformer des chaînes de caractères en JSON exploitable :
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	delete sauceObject._userId; // on utilise le userId du token
	const sauce = new Sauce({
		...sauceObject, // L'opérateur spread '...' est utilisé pour faire une copie de tous les éléments de req.body
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	});

	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
		.catch((error) => res.status(400).json({ error }));
};

//___________________ MODIFIE SAUCE ___________________
exports.modifySauce = (req, res, next) => {
	if (req.file) {
		// S'il y a une image dans le body, on supprime l'ancienne dans le dossier 'images' :
		Sauce.findOne({ _id: req.params.id }) // retrouve la sauce
			.then((sauce) => {
				// si l'id user dans la requête ne correspond pas à celui qui a créé l'original :
				if (sauce.userId != req.auth.userId) {
					return res.status(400).json({ message: 'Non autorisé' });
				} else if (sauce.userId == req.auth.userId) {
					// si l'id user est ok, on peut supprimer l'ancienne image avec unlink(). d'abord récupérer le nom d'image (en 2eme position) dans l'URL en enlevant la partie '/images/' :
					const filename = sauce.imageUrl.split('/images/')[1];
					fs.unlink(`images/${filename}`, () => {
						const sauceObject = {
							// on récupère la nouvelle image :
							...JSON.parse(req.body.sauce),
							imageUrl: `${req.protocol}://${req.get('host')}/images/${
								req.file.filename
							}`,
						};
						// puis, on met la sauce à jour :
						Sauce.updateOne(
							{ _id: req.params.id },
							{ ...sauceObject, _id: req.params.id }
						)
							.then(() => res.status(200).json({ message: 'Sauce modifiée' }))
							.catch((error) => res.status(400).json({ error }));
					});
				}
			});
	} else {
		// S'il n'y a pas de modification de l'image, on récupère la sauce pour la mettre à jour :
		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
			//on verifie que la sauce appartient bien à l'utilisateur avec verifyUser
			if (sauce.userId != req.auth.userId) {
				return res.status(400).json({ message: 'Non autorisé' });
			} else {
				const sauceObject = { ...req.body };
				Sauce.updateOne(
					{ _id: req.params.id },
					{ ...sauceObject, _id: req.params.id }
				)
					.then(() => res.status(200).json({ message: 'Sauce mise à jour' }))
					.catch((error) => res.status(400).json({ error }));
			}
		});
	}
};
//________________ AFFICHE TOUTES LES SAUCES ___________________
exports.getAllSauces = (req, res, next) => {
	Sauce.find() // liste complète
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

//___________________ AFFICHE UNE SAUCE ___________________
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error })); // 404 objet non trouvé
};

//___________________ SUPPRIME UNE SAUCE ___________________
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
				fs.unlink(`images/${filename}`, () => {
					Sauce.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({ message: 'Sauce supprimée' });
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

//_________________ LIKE and DISLIKE ___________________

/* Les trois scénarios de la fonction 'like' : 1, 0, -1.
on exporte ce middleware dans la route sauce */

exports.likeDislikeSauce = (req, res, next) => {};
