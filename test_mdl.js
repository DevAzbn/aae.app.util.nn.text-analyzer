'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var test = app.loadFile('text/default.txt');

app.clearRequireCache(require);

//console.log(app.mdl('text').getSentences(test));

var items = app.mdl('text').getSentences(test);

var res = [];

items.forEach(function(item, i, arr){
	
	res.push(app.mdl('morphy').anal(item));
	
});

app.saveJSON('text/default_result', res);