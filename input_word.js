'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

app.clearRequireCache(require);

var state = 0;

var data = {
	word : null,
	metrics : [],
};

console.log('Введите слово в начальной форме для сохранения');

process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', function(msg){
	
	switch(state) {
		
		case 0 : {
			
			data.word = msg.trim().toUpperCase();
			
			console.log('Абстрактное понятие? 0 - абстрактное, 1 - вещественное');
			
		}
		break;
		
		case 1 : {
			
			data.metrics.push(parseFloat(msg.trim().toUpperCase()));
			
			console.log('Одушевленное? 0 - нет, 1 - да');
			
		}
		break;
		
		case 2 : {
			
			data.metrics.push(parseFloat(msg.trim().toUpperCase()));
			
			console.log('Нажмите для сохранения и выхода');
			
		}
		break;
		
		default : {
			
			var wpath = data.word.split('').join('/');
			
			app.mkDataDir('words/' + wpath);
			
			app.saveJSON('words/' + wpath + '/metrics', data.metrics);
			
			process.exit();
			
		}
		break;
		
	}
	
	state++;
	
});

//app.saveJSON('text/default_result', res);