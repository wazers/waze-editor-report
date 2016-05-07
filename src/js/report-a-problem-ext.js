(function() {
	'use strict';

	var body = document.getElementsByTagName('body')[0];
	var s = document.createElement('div');
	s.setAttribute('id', 'wme-api-base');
    s.setAttribute('style', 'display:none')
	s.innerHTML = W.Config.api_base;
	body.appendChild(s);
}());
