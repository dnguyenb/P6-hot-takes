/**
 * La méthode 'express.Router()' permet de créer des routeurs
 * séparés pour
 * chaque route principale de l' application – on y enregistre
 * ensuite les routes individuelles.
 */

const express = require('express');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauces');
const router = express.Router();

// On ajoute le middleware 'auth' en premier dans les routes :
router.post('/', auth, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Rend router accessible aux autres fichiers :
module.exports = router;
