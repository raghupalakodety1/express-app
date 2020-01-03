
const path = require('path')
//about the path
var pathObj = path.parse(__filename);
console.log(pathObj);

//os module
const os = require('os');
var totalMemory = os.totalmem();
var freeMemory = os.freemem();

// Template string
// ES6 ECMAScript 6
console.log(`Total Memory: ${totalMemory}`);
console.log(`Free Memory: ${freeMemory}`);

//filesystem module
const fs = require('fs');
//always use async methods, async read dir
//const files = fs.readdirSync('./');
//console.log(files);
fs.readdir('.', function(err, files){
	if(err) console.log('Error', err);
	else console.log('Result', files);
});

// events module

const EventEmitter = require('events'); // EventEmitter here is a class
const emitter = new EventEmitter();


emitter.on('logging', (data) => {
	console.log('Logging listener called', data);
});

const Logger = require('./logger');
const logger = new Logger();

// Register a listener, arrow function
logger.on('messageLogged', (arg) => {
	console.log('Listener called', arg);
});

logger.log('message');

// Raise: logging (data: message)
//emitter.emit('logging', {log_id: 1, description: 'Successful logging'});

const http = require('http');

const server = http.createServer((req, res) => {
		// check incoming requests
		if (req.url === '/'){
		res.write('Hello World');
		res.end();
	}

	// add more routes
	if (req.url === '/api/courses'){
		res.write(JSON.stringify([1, 2, 3]));
		res.end();
	}
});


//server.listen(3000);

//console.log('Listening on port 3000');

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); // use in request processing pipeline

const courses = [
{
	id: 1, name: 'course1'
},
{
	id: 2, name: 'course2'
},
{
	id: 3, name: 'course3'
}];

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/courses/', (req, res) => {
	res.send(courses);
});

// /api/courses/1

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with given id was');
	res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
	res.send(req.query);
})

app.post('/api/courses', (req, res) => {
	const {error} = validateCourse(req.body);

	if (error){
		res.status(400).send(error.details[0].message);
		return;
	}

	const course = {
		id: courses.length + 1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course); // when we post a new resource, we should return that object in the body of response
});


//PUT request

app.put('/api/courses/:id', (req, res) => {
	//Look up the course
	// If not existing, return 404

	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with given id was');

	//validate
	// if invalid, return 400 - Bad request

	//const result = validateCourse(req.body);
	const {error} = validateCourse(req.body);

	if(error){
		// 400 bad request
		res.status(400).send(error.details[0].message);
		return; // we dont want the rest of the function to be executed
	}

	//  Update course
	
	course.name = req.body.name;
	
	//Return the updated course
	
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	// Look up the course
	// Not existing, return 404
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with given id was');

	// Delete
	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
})

// validation logic
function validateCourse(course){
	const schema = {
		name: Joi.string().min(3).required()
	};

	const result = Joi.validate(course, schema);

	return result;
}

// PORT environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));