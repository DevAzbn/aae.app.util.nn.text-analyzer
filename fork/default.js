'use strict';

var __path_prefix = '../';
var __json_prefix = __path_prefix + '../data/';

var azbn = new require(__dirname + '/' + __path_prefix + '../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var _data = azbn.mdl('process/child').parseCliData(process.argv);


var brain = require('brain.js');
var Morphy = require('phpmorphy').default;
const morphy = new Morphy('ru', {
	//nojo : false, 
	storage : Morphy.STORAGE_MEM,
	predict_by_suffix : true,
	predict_by_db : true,
	graminfo_as_text : true,
	use_ancodes_cache : false,
	resolve_ancodes : Morphy.RESOLVE_ANCODES_AS_TEXT,
});


if(_data.input && _data.input.length) {
	
	var nn_uid = 'default';
	
	var config_data = app.loadJSON(__json_prefix + 'config/' + nn_uid);
	var nn_data = app.loadJSON(__json_prefix + 'nn/' + nn_uid);
	
	var nn = new brain.NeuralNetwork(config_data);
	
	nn.fromJSON(nn_data);
	
	/* ---------- */
	
	var str = _data.input.toUpperCase();
	
	var str_arr = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, ' ').split(' ');
	
	for(var k in str_arr) {
		if(str_arr[k] == '') {
			
			str_arr.splice(k, 1);
			
		}
	}
	
	var
		__symbol_length = str.length,
		__word_length = str_arr.length,
		__non_words = 0,
		__
	;
	
	var words = [];
	
	for(var i = 0; i < str_arr.length; i++) {
		
		var _bf = morphy.getBaseForm(str_arr[i], Morphy.NORMAL);
		
		switch(typeof _bf) {
			
			case 'boolean' : {
				__non_words++;
			}
			break;
			
			case 'string' : {
				words.push(_bf);
			}
			break;
			
			case 'object':
			case 'array' : {
				for(var k in _bf) {
					words.push(_bf[k]);
				}
			}
			break;
			
			default : {
				
			}
			break;
			
		}
		
	}
	
	var _input = [
		1 / (__symbol_length || 1), // количество символов
		1 / (__word_length || 1), // количество слов
		(__non_words / (__word_length || 1)),  // доля несуществующих слов
	];
	
	/* ---------- */
	
	var _output = nn.run(_input);
	
	process.send({
		kill_child : 1,
		app_fork : 1,
		data : {
			src : {
				text : _data.input,
				as_string : str,
				as_array : str_arr,
				words : words.join(),
			},
			input : _input,
			output : _output,
		},
	});
	
} else {
	
	process.send({
		kill_child : 1,
		app_fork : 1,
		data : 'Input is empty!',
	});
	
}
