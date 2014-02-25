chrome.contextMenus.create({
	"title": chrome.i18n.getMessage('menuTitle'),
	"documentUrlPatterns": ["https://*.waze.com/*/editor/*", "https://*.waze.com/editor/*"],
	"contexts":['page'],
	"onclick": function(info, tab) {
		var desc = prompt(chrome.i18n.getMessage('enterDescription'));
		chrome.cookies.get({url: "https://www.waze.com", name: "_csrf_token"},
			function(cookie) {
				chrome.tabs.sendRequest(tab.id, 'getCurrentLocation', function(response) {
					console.log('Got coordinates: ' + JSON.stringify(response));
					
					var xhr = new XMLHttpRequest();
					xhr.open("POST", "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest", true);
					xhr.setRequestHeader('X-CSRF-Token', cookie.value);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
					xhr.send("geometry=POINT(" + response.lat + "+" + response.lon + ")&" +
						 "description=" + escape(desc) + "&" +
						 "type=7");
				});
			}
		);
	}
});