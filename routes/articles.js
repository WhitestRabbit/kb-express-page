const express = require('express');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');
const router = express.Router();


//Bring in Article model
let Article = require('../models/article');
let User = require('../models/user');

//Delete article
//Here we catch the delete request that was made with jquery
//and ajax
router.delete('/:id', (req, res) => {
    if(!req.user._id) {
        res.status(500).send();
    }
    let query = {_id: req.params.id};
    Article.findById(req.params.id, (err, article) => {
        if(article.author != req.user._id){
            res.status(500).send();
        } else {
            Article.deleteOne(query, (err) => {
                if(err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Article deleted.');
                    res.send('Successful delete');
                }
            });
        }
    });
    
});

//Add Article
//First part: render the add article page
router.get('/add', ensureAuthenticated, (req, res) => res.render('add', {
    title: 'Add Article'
    })
);

//Second part: this is where we serve the POST request of the article submission
router.post('/add', [
    body('title', 'Title cannot be nothing!').not().isEmpty(),
    body('body', 'Body cannot be nothing!').not().isEmpty(),
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add', {title: 'Add Article', errors: errors.array() });
        } else {
            let article = new Article();
            article.title = req.body.title;
            article.body = req.body.body;
            article.author = req.user._id;
            article.save((err) => {
                if(err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Article added succesfully.');
                    res.redirect('/');
                }
            });
        }
    }
);

//Edit article
//First part: Get the article to fill the form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(article.author != req.user._id){
            req.flash('danger', 'Not authorized.');
            res.redirect('/');
        }
        if(err) {
            console.log(err);
        } else {
            res.render('edit', {
                article
            });
        }
    });
});
//Second part: Receive the POST request and save it
router.post('/edit/:id', (req, res) => {
    let article = {
        title: req.body.title,
        author: req.body.author,
        body: req.body.body

    };
    let query = {_id: req.params.id};
    Article.update(query, article, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article updated.')
            res.redirect('/articles/'+req.params.id);
            // res.redirect('/');
        }
    });
});

//Get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            if(err) {
                console.log(err);
            } else {
                res.render('article', {
                    article,
                    author: user.name
                });
            }
        });
    });
});

router.get('/uploaded/:id', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) {
            console.log(err);
        } else {
            res.render('uploaded', {
            title: 'Articles by author ' + req.user.name,
            articles
            });
        }
    });   
});

//Access control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;