'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var argv = require('optimist')
	.usage('Usage: $0 --project=[Name of project]')
	.default('input', '')
	.default('project', 'default')
	.demand(['project', 'input'])
	.argv
;

app.clearRequireCache(require);

app.fork('projects/' + argv.project, argv, function(_process, _msg){
	
	if(_msg.kill_child == 1) {
		_process.kill();
	}
	
	console.dir(_msg);
	
});