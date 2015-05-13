var mousePosition;

document.addEventListener("mousedown", function(e) {
	if (e.button == 2) {
		var p = document.getElementsByClassName('mouse-position')[0].innerHTML.split(' ');
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
