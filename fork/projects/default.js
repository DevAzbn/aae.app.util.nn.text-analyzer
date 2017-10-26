'use strict';

var __path_prefix = '../../';
var __json_prefix = __path_prefix + 'data/';

var azbn = new require(__dirname + '/' + __path_prefix + '../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module, '/' + __path_prefix);

var _data = azbn.mdl('process/child').parseCliData(process.argv);


var brain = require('brain.js');
var Morphy = require('phpmorphy').default;

var morphy = {
	ru : new Morphy('ru', {
		//nojo : false, 
		storage : Morphy.STORAGE_MEM,
		predict_by_suffix : true,
		predict_by_db : true,
		graminfo_as_text : true,
		use_ancodes_cache : false,
		resolve_ancodes : Morphy.RESOLVE_ANCODES_AS_TEXT,
	}),
	en : new Morphy('en', {
		//nojo : false, 
		storage : Morphy.STORAGE_MEM,
		predict_by_suffix : true,
		predict_by_db : true,
		graminfo_as_text : true,
		use_ancodes_cache : false,
		resolve_ancodes : Morphy.RESOLVE_ANCODES_AS_TEXT,
	}),
}

if(_data.input && _data.input.length) {
	
	var nn_uid = 'default';
	
	var config_data = app.loadJSON('config/' + nn_uid);
	var nn_data = app.loadJSON('nn/' + nn_uid);
	
	var nn = new brain.NeuralNetwork(config_data);
	
	nn.fromJSON(nn_data);
	
	/* ---------- */
	
	var str = _data.input
		.trim()
		.toUpperCase()
	;
	
	//var str_arr = str.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()\[\]]/g, ' ').split(' ');
	
	var str_arr = app.mdl('text').removePunctuation(str).split(' ');
	
	for(var k in str_arr) {
		if(str_arr[k] == '') {
			
			str_arr.splice(k, 1);
			
		}
	}
	
	var
		__symbol_length = str.length,
		__word_length = str_arr.length,
		__non_words = 0,
		__has_numbers = /\d/.test(str),
		__is_exclamation = /[!]/.test(str),
		__is_question = /[?]/.test(str),
		__lang_is_ru = /[А-Яа-яЁё]/.test(str),
		__lang_is_en = /[A-Za-z]/.test(str),
		__is_personal_i = /(^|[\s\.\,\;\:])+(Я|МЕНЯ|МНЕ|МНОЙ|МНОЮ|МЫ|НАС|НАМ|НАМИ|I|ME|WE|US)+($|[\s\.\,\;\:])/.test(str), // https://ru.wikipedia.org/wiki/Личные_местоимения
		__is_personal_you = /(^|[\s\.\,\;\:])+(ТЫ|ТЕБЯ|ТЕБЕ|ТОБОЙ|ТОБОЮ|ВЫ|ВАС|ВАМ|ВАМИ|YOU)+($|[\s\.\,\;\:])/.test(str),
		__
	;
	
	var words = [];
	
	var partsOfSpeech = {};
	
	for(var i = 0; i < str_arr.length; i++) {
		
		var _bf = morphy[__lang_is_ru ? 'ru' : 'en'].getBaseForm(str_arr[i], Morphy.NORMAL);
		
		switch(typeof _bf) {
			
			case 'boolean' : {
				__non_words++;
			}
			break;
			
			case 'string' : {
				words.push(_bf);
				var _pos = morphy[__lang_is_ru ? 'ru' : 'en'].getPartOfSpeech(_bf, Morphy.NORMAL);
				if(partsOfSpeech[_pos]) {
					partsOfSpeech[_pos]++;
				} else {
					partsOfSpeech[_pos] = 1;
				}
			}
			break;
			
			case 'object':
			case 'array' : {
				for(var k in _bf) {
					words.push(_bf[k]);
					var _pos = morphy[__lang_is_ru ? 'ru' : 'en'].getPartOfSpeech(_bf[k], Morphy.NORMAL);
					if(partsOfSpeech[_pos]) {
						partsOfSpeech[_pos]++;
					} else {
						partsOfSpeech[_pos] = 1;
					}
				}
			}
			break;
			
			default : {
				
			}
			break;
			
		}
		
	}
	
	var _input = [
		-1 / (__symbol_length + 1), // количество символов
		-1 / (__word_length + 1), // количество слов
		-1 / (__non_words + 1),  // количество несуществующих в словаре слов
		(__non_words / (__word_length || 1)), // доля несуществующих слов
		(__has_numbers ? 1 : 0), // есть числа в строке
		(__is_exclamation ? 1 : 0), // восклицание
		(__is_question ? 1 : 0), // вопрос
		(__lang_is_ru ? 1 : 0), // есть русские буквы
		(__lang_is_en ? 1 : 0), // есть латинские буквы
		(__is_personal_i ? 1 : 0), // есть личностное местоимение (я, мы)
		(__is_personal_you ? 1 : 0), // есть личностное местоимение (ты, вы)
	];
	
	/* ---------- */
	
	var _output = nn.run(_input);
	
	process.send({
		kill_child : 1,
		app_fork : 1,
		//data : config_data,
		
		data : {
			src : {
				text : _data.input,
				as_string : str,
				as_array : str_arr,
				//partsOfSpeech : partsOfSpeech,
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
