chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.name == "getLatLon") {
		latlon = document.getElementsByClassName('olControlMousePosition')[0].innerHTML;
		latlon = latlon.replace(' ', '').split(',');
		sendResponse({
			lat: latlon[0],
			lon: latlon[1]
		});
	} else if (request.name == "setReport") {
		var latlon = document.getElementsByClassName('olControlMousePosition')[0].innerHTML.replace(' ', '').split(',');
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://www.waze.com/row-Descartes-live/app/MapProblems/UpdateRequest", true);

		data = {
			geometry: "POINT(" + latlon[0] + "+" + latlon[1] + ")",
			description: escape(request.value),
			type: 7
		};

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				console.log('Report sent.');
			}
		};

		xhr.send(data);

		sendResponse(true);
    }
});