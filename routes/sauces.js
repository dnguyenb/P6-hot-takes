/**
 * La méthode 'express.Router()' permet de créer des routeurs
 * séparés pour
 * chaque route principale de l' application – on y enregistre
 * ensuite les routes individuelles.
 */

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

// On ajoute le middleware 'auth' en premier dans les routes :
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Rend router accessible aux autres fichiers :
module.exports = router;
