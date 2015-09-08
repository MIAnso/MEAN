var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET posts list */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

/* GET a single post */
router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* EDIT a post */
router.put('/posts/:post', function(req, res, next) {
  Post.findByIdAndUpdate(req.params.post, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE a post */
router.delete('/posts/:post', function(req, res, next) {
  Post.findByIdAndRemove(req.params.post, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST a post */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

/* Upvote a post */
router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/* GET comments list */
router.get('/posts/:post/comments', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
	if (err) { return next(err); }

		res.json(post.comments);
	});
});

/* GET a single comment */
router.get('/posts/:post/comments/:comment', function(req, res) {
  res.json(req.comment);
});

/* DELETE a comment */
router.delete('/posts/:post/comments/:comment', function(req, res, next) {
  Comment.findByIdAndRemove(req.params.comment, req.body, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

/* POST a comment */
router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

/* Upvote a comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

module.exports = router;
