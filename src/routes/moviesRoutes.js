const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

/* /movies */
router
    .get('/', moviesController.list)
    .get('/new', moviesController.new)
    .get('/recommended', moviesController.recomended)
    .get('/detail/:id', moviesController.detail);

//CRUD 
router
    .get('/add', moviesController.add)
    .post('/create', moviesController.create)
    .get('/edit/:id', moviesController.edit)
    .put('/update/:id', moviesController.update)
    .get('/delete/:id', moviesController.delete)
    .delete('', moviesController.destroy);

module.exports = router;