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
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeDislikeSauce);


// Rend router accessible aux autres fichiers :
module.exports = router;
