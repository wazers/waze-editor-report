chrome.contextMenus.create({
	"title": chrome.i18n.getMessage('menuTitle'),
	"documentUrlPatterns": ["https://*.waze.com/*/editor/*", "https://*.waze.com/editor/*"],
	"contexts":['page'],
	"onclick": function(info, tab) {
		console.log('Clicked');

		var desc = prompt(chrome.i18n.getMessage('enterDescription'));
		chrome.cookies.get({
			url: "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest",
			name: "_csrf_token"}, function(cookie) {
				console.log('Got cookie: ' + JSON.stringify(cookie));

				chrome.tabs.sendRequest(tab.id, {name: 'getLatLon'}, function(response) {
					console.log('Got coordinates: ' + JSON.stringify(response));
					
					var xhr = new XMLHttpRequest();
					xhr.open("POST", "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest", true);
					xhr.setRequestHeader('X-CSRF-Token', cookie.value);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
					xhr.onreadystatechange = function() {
						console.log('Got response!');
						if (xhr.readyState == 4) {
							console.log('Report sent.');
						}
					};
					xhr.send("geometry=POINT(" + response.lat + "+" + response.lon + ")&" +
						 "description=" + escape(desc) + "&" +
						 "type=7");
					console.log('Sent XHR: ' + JSON.stringify(xhr));
				});
		});
		var request = {
			name: 'setReport',
			value: desc
		};
/*
		chrome.tabs.sendRequest(tab.id, request, function(response) {
			console.log('Request sent');
			console.log('Got location: ' + JSON.stringify(response));
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest", true);
			data = {
				geometry: "POINT(" + response.lat + "+" + response.lon + ")",
				description: escape(desc),
				type: 7
			};
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					console.log('Report sent.');
				}
			};
			xhr.send(data);
		});
*/
	}
});