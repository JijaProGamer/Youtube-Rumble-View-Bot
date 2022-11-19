setInterval(function() {
	let e = document.querySelector('.ytd-popup-container[popup-size="UPSELL_DIALOG_RENDERER_POPUP_SIZE_LARGE"] #dismiss-button:not(.dismissed), .upsell-dialog-lightbox .upsell-dialog-dismiss-button button:not(.dismissed)');
	
	if (e) {
		e.className += " dismissed";
		e.click();
	}
}, 500);