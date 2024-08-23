const express = require('express');
const router = express.Router();
const usersController =require('../../controllers/usersController');
router.route('/')
    .get(usersController.handleGet)
    .patch(usersController.handlePatch);

router.route('/:id')
    .get(usersController.handleSpecificGet);
module.exports = router;