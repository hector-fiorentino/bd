$(document).ready(function(){
	//TRAER POR POST LOS ID DE LAS TARJETAS DEL USUARIO
	var tarjetas=["1","4","6","9"];
	var id;
	$('.tarjeta').each(function(index){
		id = $(this).attr('data-id');
		if($.inArray(id,tarjetas)>-1){
			$(this).addClass('seleccionado');
			$(this).append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
		}
	});
	$(".tarjeta").click(function(){
		if($(this).hasClass('seleccionado')){
			$(this).removeClass('seleccionado');
			$(this).find("span").remove();
		}else{
			$(this).addClass('seleccionado');
			$(this).append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
		}
	})
	$(".guardar").click(function(){
		var userselect=new Array();
		$('.tarjeta').each(function(index){
			if($(this).hasClass('seleccionado')){
				userselect.push($(this).attr('data-id'));
			}
		})
		alert(userselect);
	})
})