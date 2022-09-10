/* multer , un package qui nous permet d'enregistrer les images arrivant du frontend dans le dossier 'images'. */
const multer = require('multer');

/**
 * Création du dictionnaire MIME_TYPES pour les extensions
 * de fichiers image possibles.
 * Constante storage qui indique à multer
    où enregistrer les fichiers entrants :

    - la fonction destination indique à  multer d'enregistrer les fichiers dans le dossier images ;

    - la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores (split et join) et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME attribuer l'extension de fichier.
*/
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	},
});

/* On exporte ensuite l'élément multer avec la constante 'storage' et on lui indique avec 'single' qu'on ne gére que les téléchargements de fichiers 'image' */
module.exports = multer({ storage: storage }).single('image');
