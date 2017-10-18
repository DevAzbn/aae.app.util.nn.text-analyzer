'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var argv = require('optimist')
	.usage('Usage: $0 --nn=[Name of neural network] --type=[Type of nn - default or rnn]')
	.default('nn', 'default')
	.default('type', 'default')
	//.demand(['str'])
	.argv
;

app.clearRequireCache(require);

var config_data = app.loadJSON('config/' + argv.nn);
var train_data = app.loadJSON('train/' + argv.nn);

//https://www.npmjs.com/package/brain.js
var brain = require('brain.js');

var nn = null;

switch(argv.type) {
	
	case 'rnn' : {
		nn = new brain.recurrent.RNN();
	}
	break;
	
	default : {
		nn = new brain.NeuralNetwork(config_data);
	}
	break;
	
}

nn.train(train_data, {
	errorThresh : 0.0005,	// error threshold to reach 0.005
	iterations : 20000,		// maximum training iterations
	log : true,				// console.log() progress periodically
	logPeriod : 1,			// number of iterations between logging
	learningRate : 0.1		// learning rate
});

app.saveJSON('nn/' + argv.nn, nn.toJSON());
//app.saveJSON('normal/' + argv.nn, train_data);
