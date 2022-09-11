// Imposer un format de mot de passe fort à l'utilisateur lors de son inscription :
const passwordValidator = require('password-validator');

// Creation du schema de mot de passe :
const passwordSchema = new passwordValidator();

// Ajout des propriétés au schema (npmjs.com) :
passwordSchema
	.is()
	.min(6) // Doit avoir une longueur minimum de 6 caractères

	.is()
	.max(100) // Doit avoir une longueur maximum de 100 caractères

	.has()
	.uppercase() // Doit contenir au moins 1 lettre majuscule

	.has()
	.lowercase() // Doit contenir au moins 1 lettre minuscule

	.has()
	.digits(2) // Doit avoir au moins 2 chiffres

	.has()
	.not()
	.spaces(); // Ne doit pas contenir d'espace

// On rend le middleware accessible pour le passer dans la route signup de user, au moment de la création du mot de passe :
module.exports = (req, res, next) => {
	if (passwordSchema.validate(req.body.password)) {
		next();
	} else {
		return res.status(400).json({
			message:
				'le mot de passe doit contenir entre 6 et 100 caractères avec au moins 2 chiffres, des lettres minuscules et majuscules, sans espace',
		});
	}
};
