'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var test = app.loadFile('text/default.txt');

app.clearRequireCache(require);

console.log(app.mdl('text').getSentences(test));