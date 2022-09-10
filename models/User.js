// Import mongoose
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Construction du modèle 'User' avec la fonction 'Schema' de mongoose :
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Empêche d'avoir plusieurs utilisateurs avec la même adresse email
userSchema.plugin(uniqueValidator);

// Le modèle s'appelle 'User' et on lui passe le Schema de données
module.exports = mongoose.model('User', userSchema);
