/**
 * Un fichier controller exporte des méthodes qui sont ensuite
 * attribuées aux routes pour améliorer la maintenabilité
 * de l' application.
 */

// On utilise le schema 'Sauce', donc on l'importe :
const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
	delete req.body._id;
	const sauce = new Sauce({
		...req.body, // L'opérateur spread '...' est utilisé pour faire une copie de tous les éléments de req.body
	});
	sauce
		.save() // enregistre dans la BDD.
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
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

exports.deleteSauce = (req, res, next) => {
	Sauce.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
		.catch((error) => res.status(400).json({ error }));
};
