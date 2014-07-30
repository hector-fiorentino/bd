var idUser;
var seudonimoUser;
function setUser(id,seudonimo){
	idUser = id;
	seudonimoUser = seudonimo;
}
function getUser(dato){
	if(dato=='id'){
		return id;
	}else{
		return seudonimo;
	}
}

$(document).ready(function(){
	/*if(window.localStorage.getItem("userID")){
		setUser(window.localStorage.getItem("userID"),window.localStorage.getItem("userName"));
		alert(getUser('name'));
	}*/
	function responsive(){
	alert("ok");
	var dpi = window.devicePixelRatio;
	var folder = "mdpi";
	
	switch(dpi){
		case 1:
			if(window.width()>320){
				folder = "xxhdpi";
				//$('body').css('zoom','3');
			}else{
				folder = "mdpi";
				//$('body').css('zoom','1');
			}
		break;
		case 1.5:
		 	folder = "hdpi";
		 	//$('body').css('zoom','1.5');
		break;
		case 2:
			folder = "xhdpi";
			//$('body').css('zoom','2');
		break;
		case 3:
			folder = "xxhdpi";
			//$('body').css('zoom','3');
		break;
	}
	//Buscar imagenes con dpi variable y reemplaza el folder por el adecuado.
	var els = jQuery("img.dpi-var").get();
		for(var i = 0; i < els.length; i++) {
			var src = els[i].src
			src = src.replace("res-dpi", folder);
			els[i].src = src;
		}
}
	$( "body>[data-role='panel']" ).panel();
	$.mobile.changePage("login.html");
})