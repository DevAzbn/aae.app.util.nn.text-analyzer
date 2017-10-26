'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var test = 'Привет! Как дела? Z crexf. 98 попугаев! Я хочу тебя навестить...\nКогда будешь свободен?';

app.clearRequireCache(require);

console.log(app.mdl('text').getSentences(test));