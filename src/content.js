chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request == "getCurrentLocation") {
		latlon = document.getElementsByClassName('olControlMousePosition')[0].innerHTML;
		latlon = latlon.replace(' ', '').split(',');
		sendResponse({
			lat: latlon[0],
			lon: latlon[1]
		});
	}
});