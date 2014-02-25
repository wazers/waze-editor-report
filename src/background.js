chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		"title":		chrome.i18n.getMessage('menuTitle'),
		"documentUrlPatterns":	["https://*.waze.com/*/editor/*", "https://*.waze.com/editor/*"],
		"contexts":		['page'],
		"id":			'WazeEditorReportSend'});

});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId != "WazeEditorReportSend") { return };

	var desc = prompt(chrome.i18n.getMessage('enterDescription'));
	if (!desc) return;

	chrome.cookies.get({url: "https://www.waze.com", name: "_csrf_token"},
		function(cookie) {
			chrome.tabs.sendMessage(tab.id, 'getCurrentLocation', function(response) {
				console.log('Got coordinates: ' + JSON.stringify(response));

				var xhr = new XMLHttpRequest();
				xhr.open("POST", "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest", true);
				xhr.setRequestHeader('X-CSRF-Token', cookie.value);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

				xhr.send("geometry=POINT(" + response.lat + "+" + response.lon + ")&" +
					 "description=" + desc + "&" +
					 "type=10");
			});
		}
	);
});
