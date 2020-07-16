const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost/blogApp',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
	console.log('DATABASE Connected');
});

mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog',blogSchema);

// Blog.create({
// 	title: 'Test Blog',
// 	image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&h=350',
// 	body: 'All about Technologies and stuff..!',
// }, (err, body) => {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(body);
// 	}
// });

//INDEX ROUTE
app.get('/', (req,res) => {
	res.redirect('/blogs');
});

app.get('/blogs',(req,res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			console.log(err);
		} else {
			res.render('index', {blogs: blogs});
		}
	});
	
});

//NEW ROUTE
app.get('/blogs/new', (req,res) => {
	res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req,res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err,body) => {
		if(err) {
			res.render('new');

		} else {
			res.redirect('/blogs');
		}
	});
});

//SHOW
app.get('/blogs/:id', (req,res) => {
	Blog.findById(req.params.id, (err, body) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('show', {blog: body});
		}
	})
});

//EDIT
app.get('/blogs/:id/edit',(req,res) => {
	Blog.findById(req.params.id, (err, body) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.render('edit',{blog: body});
		}
	});
});

//UPDATE
app.put('/blogs/:id', (req,res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, body) => {
		if(err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});
//DELETE
app.delete('/blogs/:id', (req,res) => {
	Blog.findByIdAndDelete(req.params.id, (err) => {
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	})
});

app.listen(3000, () => {
	console.log('Server Started on port 3000..');
});