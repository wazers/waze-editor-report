chrome.runtime.onInstalled.addListener(function() {
	var types = [10, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18];
	for (i in types) {
		chrome.contextMenus.create({
			'title':		chrome.i18n.getMessage('reportType' + types[i]),
			'documentUrlPatterns':	['https://*.waze.com/*/editor/*', 'https://*.waze.com/editor/*'],
			'contexts':		['page'],
			'id':			'Waze_Report_' + types[i]});
	}
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	var mid = 'Waze_Report_';
	if (info.menuItemId.indexOf(mid) != 0) { console.log(info.menuItemId); return };

	typeno = info.menuItemId.slice(mid.length);
	var desc = prompt(chrome.i18n.getMessage('enterDescription'));
	if (!desc) return;

	chrome.cookies.get({url: 'https://www.waze.com', name: '_csrf_token'},
		function(cookie) {
			chrome.tabs.sendMessage(tab.id, 'getCurrentLocation', function(response) {
				console.log('Got coordinates: ' + JSON.stringify(response));

				var xhr = new XMLHttpRequest();

				xhr.open('POST', getUpdateUrl('world'), true);
				xhr.setRequestHeader('X-CSRF-Token', cookie.value);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

				xhr.send('geometry=POINT(' + response.lat + '+' + response.lon + ')&' +
					 'description=' + desc + '&' +
					 'type=' + typeno);
			});
		}
	);

	function getUpdateUrl(server) {
		var prefixes = {
			israel: 'il-',
			world: 'row-',
			usa: ''
		};
		return 'https://www.waze.com/'
			+ prefixes[server] + 'Descartes-live/app/MapProblems/UpdateRequest';
	}
});
