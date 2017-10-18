'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var argv = require('optimist')
	.usage('Usage: $0 --nn=[Name of neural network]')
	.default('nn', 'default')
	.default('input', '0,1')
	//.demand(['str'])
	.argv
;

app.clearRequireCache(require);

var config_data = app.loadJSON('config/' + argv.nn);
//var train_data = app.loadJSON('train/' + argv.nn);
var nn_data = app.loadJSON('nn/' + argv.nn);

var brain = require('brain.js');

var nn = new brain.NeuralNetwork(config_data);

nn.fromJSON(nn_data);

var _input = {
	x : (1/(1 + (Math.exp(- argv.x)))),
	//g : 0,
	b : (1/(1 + (Math.exp(- argv.b)))),
};

var _output = nn.run(argv.input.split(','));

/*
train_data.push({
	input : _input,
	output : _output,
})

app.saveJSON('train/' + argv.nn, train_data);

app.saveJSON('nn/' + argv.nn, nn.toJSON());
*/

console.log(_output);
