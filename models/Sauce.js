/* Mongoose est un package qui permet de faciliter la lecture et l'écriture dans une BDD mongoDB */
const mongoose = require('mongoose');

// On utilise la méthode 'Schema' de mongoose pour construire le modèle avec les champs d'après requirements et caractère obligatoire :
const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true, min: 1, max: 10 },
	likes: { type: Number, required: true, default: 0 },
	dislikes: { type: Number, required: true, default: 0 },
	usersLiked: { type: [String], required: true },
	usersDisliked: { type: [String], required: true },
});

// La méthode 'model' transforme ce modèle en un modèle utilisable. On l'exporte :
module.exports = mongoose.model('Sauce', sauceSchema);
