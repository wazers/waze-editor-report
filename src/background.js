(function() {
	'use strict';

	function setContextMenu() {
		var types = [10, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18];
		for (var i in types) {
			chrome.contextMenus.create({
				'title': chrome.i18n.getMessage('reportType' + types[i]),
				'documentUrlPatterns':	[
					'https://*.waze.com/*/editor/*',
					'https://*.waze.com/editor/*'
				],
				'contexts': ['page'],
				'id': 'Waze_Report_' + types[i]
			});
		}
	}

	function buttonClicked(info, tab) {
		var mid = 'Waze_Report_';
		if (info.menuItemId.indexOf(mid) != 0) {
			console.log(info.menuItemId);
			return;
		}

		var typeno = info.menuItemId.slice(mid.length);
		var description = prompt(chrome.i18n.getMessage('enterDescription'));
		if (!description) return;

		sendReport(typeno, description, tab);
	}

	function sendReport(typeno, desc, tab) {
		chrome.cookies.get({url: 'https://www.waze.com', name: '_csrf_token'}, function(cookie) {
			chrome.tabs.sendMessage(tab.id, 'getCurrentLocation', function(geolocation) {
				chrome.tabs.sendMessage(tab.id, 'getApiBase', function(apiBase) {
					var xhr = new XMLHttpRequest();

					xhr.open('POST', getUpdateUrl(apiBase), true);
					xhr.setRequestHeader('X-CSRF-Token', cookie.value);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

					xhr.send('geometry=POINT(' + geolocation.lat + '+' + geolocation.lon + ')&' +
							'description=' + desc + '&' +
							'type=' + typeno);
				 });
			});
		});

		function getUpdateUrl(apiBase) {
			return 'https://www.waze.com' + apiBase + '/MapProblems/UpdateRequest';
		}
	}

	chrome.contextMenus.onClicked.addListener(buttonClicked);
	chrome.runtime.onInstalled.addListener(setContextMenu);
}());
