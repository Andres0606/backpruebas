const express = require('express');

const {
  listarRoles,
} = require('../controllers/rolController');

const router = express.Router();

router.get('/', listarRoles);

module.exports = router;