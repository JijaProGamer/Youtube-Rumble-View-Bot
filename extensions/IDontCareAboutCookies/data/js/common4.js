var counter = 0;

var interval = setInterval(function(){
	var element = document.querySelector('.CookiesOK');
	counter++;
	
	if (element)
		element.click();
	
	if (element || counter == 200)
		clearInterval(interval);
}, 500);