'use strict';

var _ = function(app, p) {
	
	var azbn = app.azbn;
	
	var ctrl = {
		
		getSentences : function(str) {
			
			var _rs = azbn.randstr();
			var _re = new RegExp('([\.]|[?]|[!])([ ]|[\n])([0-9A-Za-zА-Яа-яЁё])', 'g');//im
			
			var result = [];
			
			var _str = (str || '').trim();
			
			_str = _str
				//.replace(/\.\s([A-ZА-ЯЁ])/g, '$1' + _rs + '$2')
				.replace(_re, '$1' + _rs + '$3')
			;
			
			return _str.split(_rs);
			
		},
		
		removePunctuation : function(str) {
			
			//var _re = new RegExp('[\.,\/#!?$%\^&\*;:{}=\-_`~()\[\]]', 'g');//im
			var _re = /[.,\/#!?$%\^&\*;:{}=\-_`~()\[\]]/g;
			
			return str.replace(_re, ' ');
			
		},
		
	};
	
	return ctrl;
	
};

module.exports = _;