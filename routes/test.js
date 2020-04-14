const express = require('express');
const router = express.Router();

const testController = require('../_temp/controllers/testController'); 

router.get('/', testController.addRecipe);
router.get('/addrecipe', testController.addRecipe);

module.exports = router;