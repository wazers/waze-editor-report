var mousePosition;

document.addEventListener("mousedown", function(e) {
	if (e.button == 2) {
		var p = document.getElementsByClassName('olControlMousePosition')[0].innerHTML.replace(' ', '').split(',');
		mousePosition = {
			lat: p[0],
			lon: p[1]
		};
	}
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "getCurrentLocation") {
		sendResponse(mousePosition);
	}
});
