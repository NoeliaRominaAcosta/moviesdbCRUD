const moment = require('moment');
const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        //acceder a genre qye esta en modelos
        db.Genre.findAll({
            order : [
                ['name','ASC']
            ]//las ordena en orden alfabetico
        })
            .then(genres => {
               /*  return res.send(genres) */ //lo hacemos para ver lo que llega para ver como te esta mandando
                return res.render('moviesAdd', {
                    genres
                }) 
            }) //cuando lo encuentra renderiza la vsta
        .catch(error => console.log(error));
    },
    create: function (req, res) {
        const {title,awards, release_date,genre_id,rating,length} = req.body
       db.Movie.create({
        title : title.trim(),
        awards : +awards,
        release_date,
        genre_id : +genre_id,
        rating : +rating,
        length: +length
       })//el create me da el elemento recien creado 
       .then(movie => {
        console.log(movie);
        return res.redirect('/movies/detail/' + movie.id)
       })
       .catch(error => console.log(error))
    },
    edit: function(req, res) {
       const movie = db.Movie.findByPk(req.params.id)
       const genres = db.Genre.findAll({
        order : ['name']
       })
       Promise.all([movie,genres]) //le paso todas las promesas
        //necesito mandar tambien el genero por eso uso promise all
        .then(([movie,genres]) => {//al then le paso la promise all
            return res.render('moviesEdit',{
                Movie : movie,
                release_date : moment(movie.release_date).format('YYY-MM-DD'),//hay que cambiar el formato porque en sql es diferente
                genres
            })
        })
        .catch(error => console.log(error))
    },
    update: function (req,res) {
        // dos objetos : que queres editar, donde queres editarlo
        const {title,awards, release_date,genre_id,rating,length} = req.body

        db.Movie.update(
            { 
                title : title.trim(),
                awards : +awards,
                release_date,
                genre_id : +genre_id,
                rating : +rating,
                length: +length

            },
            {
                where : {
                    id : req.params.id
                }
            }
        ).then(() => res.redirect('/movies'))
        .catch(error => console.log(error))

    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then(movie => res.render('moviesDelete',{
            movie
        })).catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.movie.destroy({
            where : {
                id : req.params.id
            }
        }).then(() => res.redirect('/movies'))
        .catch(error => console.log(error))
    }

}

module.exports = moviesController;