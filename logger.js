console.log(__filename);
console.log(__dirname);

const EventEmitter = require('events');
var url = 'http://mylogger.io/log';

class Logger extends EventEmitter{
 log(message){
	// send http request
	console.log(message);
	// Raise an event. Event arguments
	this.emit('messageLogged', {id: 1, url: 'http://www.google.com', message});
}	
}

module.exports= Logger; // export Logger class