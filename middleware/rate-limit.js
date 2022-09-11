// Sert à limiter le nombre  de tentatives de requêtes à l'API (npmjs.com) :
const rateLimit = require('express-rate-limit');

// On exporte vers la route 'user' avec les paramètres choisis :
module.exports = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limite chaque IP à 100 requêtes par fenêtres de tentatives de 15 minutes.
});
