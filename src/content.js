(function() {
	'use strict';

	var mousePosition;

	window.addEventListener('message', function(event) {
		console.log(event);
	});

	function answerThePhone(request, sender, sendResponse) {
		switch (request) {
			case 'getCurrentLocation':
				sendResponse(mousePosition);
				break;
			case 'getApiBase':
				sendResponse(document.getElementById('wme-api-base').innerHTML);
				break;
			default:
				console.error('Unknown request', request);
		}
	}

	function saveLocation(e) {
		if (e.button == 2) {
			var p = document.getElementsByClassName('mouse-position')[0].innerHTML.split(' ');
			mousePosition = {
				lat: p[0],
				lon: p[1]
			};
		}
	}

	function injectScript(file, node) {
		var el = document.getElementsByTagName(node)[0];
		var s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', file);
		el.appendChild(s);
	}

	document.addEventListener('mousedown', saveLocation);
	chrome.extension.onMessage.addListener(answerThePhone);
	injectScript(chrome.extension.getURL('/js/report-a-problem-ext.js'), 'body');
}());
