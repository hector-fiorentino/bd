$(document).ready(function(){
	var RUTA = "http://192.168.0.2/bigdesc/backend/";
	$( "body>[data-role='panel']" ).panel();
	//Validación de usuario
	var userID = window.localStorage.getItem('userID');
	var userName = window.localStorage.getItem('userName');
	var categorias = new Array();
	var todastarjetas = new Array();
	var mistarjetasG = new Array();
	var detalleID = 0;
	var vuelvoDeDetalle = false;
	if(userID>0){
		if($.mobile.activePage[0].id){
			$("#nameuser").html(userName);
			$.mobile.changePage('#pagehome');
		}
	}
	var dpi = window.devicePixelRatio;
	var folder = "mdpi";
	var foldernum = "80";
	switch(dpi){
		case 1:
			//if(window.width()>320){
				//folder = "xxhdpi";
				//foldernum = "240";
				//$('body').css('zoom','3');
			//}else{
				folder = "mdpi";
				foldernum = "80";
				//$('body').css('zoom','1');
			//}
		break;
		case 1.5:
		 	folder = "hdpi";
		 	foldernum = "120";
		 	//$('body').css('zoom','1.5');
		break;
		case 2:
			folder = "xhdpi";
			foldernum = "160";
			//$('body').css('zoom','2');
		break;
		case 3:
			folder = "xxhdpi";
			foldernum = "240";
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

	var cates = $.post(RUTA + 'categorias/service',{},function(exito){
		if(exito){
			var tot = exito.length;
			for(var c =0; c<tot; c++){
				var icono = exito[c].icono;
				icono = icono.replace("icon","fa");
				$("#categorias").append('<li><a href="#pagehome" class="catfil" data-transition="fade" rel="'+exito[c].id+'" title="'+exito[c].tag+'"><i class="'+exito[c].icono+'"></i> '+exito[c].tag+' </a></li>');
				//categorias.push(new Array(exito[c].id,exito[c].color));
				categorias[exito[c].id]=exito[c].color;
			} 
			$("#categorias").trigger('create');
			
		}
	},"json");
	cates.fail(function(){
		alert("Lo sentimos. Hubo un problema cargando las categorias");
	})

	$("#pagehome").on("pageshow", function(event){
		if(vuelvoDeDetalle==false){
			traerHome();
		}
	})
	
	function traerHome(){
		$("#destacado").show();
		$(".miga").hide();
		$("#dest-home").empty();
		var tar = $.post(RUTA + 'tarjetas/todas',{user:userID},function(exito){
			if(exito){
				tot = exito.todas.length;
				for(var e=0;e<tot;e++){
					//alert(exito.todas[e].id+" = "+exito.todas[])
					todastarjetas[exito.todas[e].id]=exito.todas[e].tag;
				}
				tot = exito.mias.length;
				for(var y=0;y<tot;y++){
					mistarjetasG.push(exito.mias[y].id);
				}
			}
		},"json")
		//TRAER BANNER
		$("#destacado").html('<i class="fa fa-spinner fa-spin"></i>');
		var banner = $.post(RUTA + 'destacados/service',{},function(exito){
			if(exito){
				$("#destacado").html("<img src='"+RUTA+"public/assets/banners/"+folder+"/"+exito+"'/>");
			}else{
				alert('error');
			}
		});
		banner.fail(function(){
			alert("sin conexión");
		})
		var posteos = $.post(RUTA + 'descuentos/home',{user:userID},function(exito){
			if(!exito.error){
				var total=exito.length;
				var post=""
				for(var p = 0; p<total; p++){
					post = '<li data-icon="false">';
					post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
					post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
					post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
					post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
					post += '<p class="breve">'+exito[p].breve+'</p>';
					post += '<p class="tiempo"><i class="icon-time"> '+tiempoLimite(exito[p].fhasta)+'</i> </p>';
					if(exito[p].dias=="Todos"){
						dias = "Todos los días";
					}else{
						dias = exito[p].dias;
					}
					post += '<p class="atributo"><i class="icon-calendar"></i> '+dias+'</p>';
					post += '<p class="tags">';
        			tinc=pasarArreglo(exito[p].tarjetasId);
        			for(var mt = 0; mt<tinc.length;mt++){
        				if($.inArray(tinc[mt],mistarjetasG)){
        					post +='<span class="tag">'+todastarjetas[tinc[mt]]+'</span>';
        				}
        			}
        			post +='</p></a>';
        			colorcat = pasarArreglo(exito[p].categoriasID);
        			//tarjetas incluidas
        			post +='<span class="catecolor" style="background-color:'+categorias[colorcat[0]]+'"></span>';
        			post +='</li>';
					$("#dest-home").append(post);
				}
				$("#dest-home").listview( "refresh" );
			}else{
				alert('No hay tarjetas configuradas');
			}
		},"json");
		posteos.fail(function(){
			alert('error');
		})
		vuelvoDeDetalle=false;
	}

	$(".volver").click(function(){
		event.preventDefault();
		javascript:history.back(1);
	})
	$("#pagehome").on("click",".ui-input-clear",function(){
		vuelvoDeDetalle=false;
		traerHome();
	})

	$("#dest-home").on("click",".preview", function(){
		detalleID = $(this).attr('rel');
		var jqhrx = $.post(RUTA + 'descuentos/detalle',{id:$(this).attr('rel')},function(exito){
			if(!exito.error){
				$.mobile.changePage('#pagedetalle');
				vuelvoDeDetalle=true;
				$("#postpromo").html("<strong style='color:"+exito.color+"'>Beneficio:</strong> "+exito.promo);
				$("#img-detalle").html('<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito.imagen+'" width="100%"/>');
				if(exito.dias=="Todos"){
					dias = "Todos los días";
				}else{
					dias = "Los "+exito.dias;
				}
				$("#dias").html(dias+ "<br>" +tiempoLimite(exito.fhasta));
				$("#posttitle").html(exito.titulo);
				$("#postbreve").html(exito.breve);
				$("#exppromo").html(exito.masinfo);
				$("#detTags").empty();
				tinc=pasarArreglo(exito.tarjetasId);
        		for(var mt = 0; mt<tinc.length;mt++){
        				if($.inArray(tinc[mt],mistarjetasG)){
        					$("#detTags").append('<span class="tag">'+todastarjetas[tinc[mt]]+'</span>');
        				}else{
        					$("#detTags").append('<span class="tag nohay">'+todastarjetas[tinc[mt]]+'</span>');
        				}

        		}
        		$(".masinfo").html("<br>"+exito.descripcion);
			}
		},"json");
		jqhrx.fail(function(){
			alert("error");
		})		
	})

	//$('#searchinput').click(function(){})
	$("#searchinput").bind( "change", function(event, ui) {
		alert("Change");
  		if($(this).val()!=""){
  			$("#destacado").hide();
  			$("#dest-home").empty();
  			$.mobile.loading( 'show', {
                text: 'Buscando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
        	alert("funciona");
  			var Q = $(this).val();
  			var posteos = $.post(RUTA + 'descuentos/busqueda',{q:Q,user:userID},function(exito){
			if(!exito.error){
				alert("SIN ERROR="exito);
				var total=exito.length;
				$(".miga").html(total+' descuentos de <strong><i>"'+Q+'"</i></strong>');
				$(".miga").show();
				var post=""
				for(var p = 0; p<total; p++){
					post = '<li data-icon="false">';
					post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
					post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
					post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
					post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
					post += '<p class="breve">'+exito[p].breve+'</p>';
					post += '<p class="tiempo"><i class="icon-time"> '+tiempoLimite(exito[p].fhasta)+'</i> </p>';
					if(exito[p].dias=="Todos"){
						dias = "Todos los días";
					}else{
						dias = exito[p].dias;
					}
					post += '<p class="atributo"><i class="icon-calendar"></i> '+dias+'</p>';
					post += '<p class="tags">';
        			tinc=pasarArreglo(exito[p].tarjetasId);
        			for(var mt = 0; mt<tinc.length;mt++){
        				if($.inArray(tinc[mt],mistarjetasG)){
        					post +='<span class="tag">'+todastarjetas[tinc[mt]]+'</span>';
        				}
        			}
        			post +='</p></a>';
        			colorcat = pasarArreglo(exito[p].categoriasID);
        			//tarjetas incluidas
        			post +='<span class="catecolor" style="background-color:'+categorias[colorcat[0]]+'"></span>';
        			post +='</li>';
					$("#dest-home").append(post);
				}
				$("#dest-home").listview( "refresh" );
				$.mobile.loading('hide');
			}else{
				$.mobile.loading('hide');
				$(".miga").html("No se encontraron resultados con <strong><i>"+Q+"</i></strong>");
				$(".miga").show();
			}
		},"json");
		posteos.fail(function(){
			alert('error');
		})
  		}
	});
	
	$("#bancos").on("click",".banco", function(){
			$.mobile.loading( 'show', {
                text: 'Cargando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
        	$("#tarjetas").empty();
        	var ID = $(this).attr('data-id');
        	var Nombre = $(this).find('img').attr('title');
    		$("#popupTarj h3").html(Nombre);
    		$("#bancoactual").val(ID);
			var jqhrx = $.post(RUTA+"tarjetas/relaciones",{id:ID,n:Nombre,userid:userID},function(exito){
			if(exito){
				var tottar=exito.length
				if(tottar<1){
					$("#tarjetas").append('No hay tarjetas asociadas');
				}
				var opciones='<fieldset data-role="controlgroup" class="fieldsettar">';
				for(var a=0;a<tottar;a++){
					checked="";
					if(exito[a].activo==1){
						checked='checked=""';
					}
    				opciones+='<input type="checkbox" name="emitidas" id="checkbox-'+a+'a" value="'+exito[a].id+'" '+checked+' >';
    				titulo = exito[a].tag;
    				opciones+='<label for="checkbox-'+a+'a">'+titulo.replace(Nombre+" ","")+'</label>';
				}
				opciones+='</fieldset>';
				$("#tarjetas").html(opciones);
				$("#tarjetas").trigger('create');
				$.mobile.loading( 'hide');
				}
			$.mobile.loading('hide');
		},"json");
		jqhrx.fail(function(){
			alert("error tar");
			$.mobile.loading('hide');
		})
			$("#popupTarj").popup('open');
			// if($(this).hasClass('seleccionado')){
			// 	$(this).removeClass('seleccionado');
			// 	$(this).find("span").remove();
			// }else{
			// 	$(this).addClass('seleccionado');
			// 	$(this).append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
			// }
		})
	$(".guardar").click(function(){
		$.mobile.loading( 'show', {
                text: 'Guardando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
		var BANCO = $("#bancoactual").val();
		var mistarjetas=[];
		$('input[name=emitidas]').each(function(){
			if(this.checked){
				mistarjetas.push($(this).val());
			}
		})
		if(mistarjetas.length==0){
			mistarjetas = "vacio";
		}
		//GUARDO LA CONFIGURACION
		var jqhrx = $.post(RUTA+'tarjetas/setusuario',{idBanco:BANCO,userid:userID,tarjs:mistarjetas},function(exito){
			if(exito){
				//Marco con un check el banco si tengo tarjetas marcadas adentro.
				if(mistarjetas!="vacio"){
				 	$("div[data-id='" + BANCO + "']").addClass('seleccionado');
				 	$("div[data-id='" + BANCO + "']").append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
				 }else{
				 	$("div[data-id='" + BANCO + "']").removeClass('seleccionado');
				 	$("div[data-id='" + BANCO + "']").find("span").remove();
				 } 
				 $.mobile.loading('hide');
				 $("#popupTarj").popup('close');
			}
		})//METER "JSON"
		jqhrx.fail(function(e){
			alert(JSON.stringify(e));
		})
	})

	
	// PAGE FAVORITOS //
	$("#pagefavoritos").on("pageshow", function(event){
		$("#favoritos").html();
		var posteos = $.post(RUTA + 'favoritos/traer',{user:userID},function(exito){
			if(!exito.error){
				var total=exito.length;

				var post=""
				for(var p = 0; p<total; p++){
					post = '<li data-icon="false" id="ren'+exito[p].id+'">';
					post += '<span class="favrem" data-id="'+exito[p].id+'"><i class="icon-remove-sign"></i></span>';
					post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
					post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
					post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
					post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
					post += '<p class="breve">'+exito[p].breve+'</p>';
					post += '<p class="tiempo"><i class="icon-time"> '+tiempoLimite(exito[p].fhasta)+'</i> </p>';
					if(exito[p].dias=="Todos"){
						dias = "Todos los días";
					}else{
						dias = exito[p].dias;
					}
					post += '<p class="atributo"><i class="icon-calendar"></i> '+dias+'</p>';
					post += '<p class="tags">';
        			tinc=pasarArreglo(exito[p].tarjetasId);
        			for(var mt = 0; mt<tinc.length;mt++){
        				if($.inArray(tinc[mt],mistarjetasG)){
        					post +='<span class="tag">'+todastarjetas[tinc[mt]]+'</span>';
        				}
        			}
        			post +='</p></a>';
        			colorcat = pasarArreglo(exito[p].categoriasID);
        			//tarjetas incluidas
        			post +='<span class="catecolor" style="background-color:'+categorias[colorcat[0]]+'"></span>';
        			post +='</li>';
					$("#favoritos").append(post);
				}
				$("#favoritos").listview( "refresh" );
			}else{
				alert('No hay descuentos favoritos');
			}
		},"json");
		posteos.fail(function(){
			alert('error');
		})
	})
	$(".addfav").click(function(){
		$.post(RUTA + 'favoritos/guardar',{user:userID,desc:detalleID},function(exito){
			if(exito){
				alert("Se agregó correctamente");
			}
		})
	})
	$("#pagefavoritos").on("click",".favrem",function(){
		var ID = $(this).attr('data-id');
		$.post(RUTA + 'favoritos/borrar',{fav:ID,user:userID},function(exito){
			if(exito){
				$("#ren"+ID).remove();
			}
		})
	})

	$("#pagetarjetas").on("pageshow", function(event){
		//LLenar con tarjetas
		$("#tarjetas").empty();
		$("#bancos").empty();
		$.mobile.loading( 'show', {
                text: 'Cargando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
		var jqhrx = $.post(RUTA+"tarjetas/tarjetasService",{},function(exito){
			if(exito){
				var tottar=exito.length
				var tag="";
				var medio = "";
				var counter = 0;
				for(var a=0;a<tottar;a++){
					//alert(exito.tarjetas[a].id);
					if(counter==1){
						medio = " medio";
						counter++
					}else{
						medio = "";
						counter++;
					}
					if(counter==3){
						counter ==0;
					}
					if(exito[a].icono != ""){
						tag = '<img src="'+RUTA+'public/assets/tarjetas/'+foldernum+'/'+exito[a].icono+'" title="'+exito[a].tag+'" width="80" height="80" />';
					}else{
						tag = exito[a].tag;
					}
					$("#bancos").append('<div class="banco'+medio+'" data-id="'+exito[a].id+'">'+tag+'</div>')
				}
				$.mobile.loading( 'hide');
				

				var consulta = $.post(RUTA+"tarjetas/vinculadas",{userid:userID},function(dato){
					if(dato){
						var dt = dato.length;
						var elem;
						for(var d = 0; d < dt; d++){
							
							//alert($(".tarjetas [data-id="+dato[d].id+"]"));
							$("div[data-id='" + dato[d].tag_id + "']").addClass('seleccionado');
							$("div[data-id='" + dato[d].tag_id + "']").append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
						}	
					}
					$.mobile.loading('hide');
				},"json");
				consulta.fail(function(){
					alert("ERROR");
					$.mobile.loading('hide');
				})
			}
			$.mobile.loading('hide');
		},"json");
		jqhrx.fail(function(){
			alert("error Bancos");
			$.mobile.loading('hide');
		})
		//TRAER POR POST LOS ID DE LAS TARJETAS DEL USUARIO
		/*var tarjetas=["1","4","6","9"];
		var id;
		$('.tarjeta').each(function(index){
			id = $(this).attr('data-id');
			if($.inArray(id,tarjetas)>-1){
				$(this).addClass('seleccionado');
				$(this).append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
			}
		});*/

		// $(".guardar").click(function(){
		// 	$.mobile.loading( 'show', {
  //               text: 'Guardando',
  //               textVisible: true,
  //               theme: 'a',
  //               html: ""
  //       	});
		// 	var userselect=new Array();
		// 	$('.tarjeta').each(function(index){
		// 		if($(this).hasClass('seleccionado')){
		// 			userselect.push($(this).attr('data-id'));
		// 		}
		// 	})
		// 	var jqhrx = $.post(RUTA+'tarjetas/setusuario',{userid:userID,tarjetas:userselect},function(exito){
		// 		if(exito=="ok"){
		// 			//hacer algo
		// 			$.mobile.changePage('#pageconfig');
		// 			$.mobile.loading('hide');
		// 		}else{
		// 			alert("error");
		// 			$.mobile.loading('hide');
		// 		}
		// 	});
		// 	jqhrx.fail(function(){
		// 		alert("Error en conexión. Vuelva a intentarlo");
		// 		$.mobile.loading('hide');
		// 	})
		// 	//alert(userselect);
		// })

	})
	$(".finalizar").click(function(){
		$.mobile.changePage('#pagehome');
	})
$(".miga").on('click','.reiniciar',function(e){
		e.preventDefault();
		vuelvoDeDetalle=false;
		traerHome();
	})
	$("#categorias").on('click','.catfil',function(){
		event.preventDefault();
		var CAT=$(this).attr('rel');
		var CATNAME =$(this).attr('title');
		var activePage = $.mobile.activePage[0].id;
		//if(activePage == "pagehome" && $("#searchinput").val()!=""){
			//FILTRO LA BÚSQUEDA.
		//}else{
			$("#catespanel").panel("close");
				$("#destacado").hide();
  			$("#dest-home").empty();
  			$.mobile.loading( 'show', {
                text: 'Buscando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
				var posteos = $.post(RUTA + 'descuentos/busquedaCat',{cat:CAT,user:userID},function(exito){
				if(!exito.error){
					var total=exito.length;
					$(".miga").html(total+' descuentos en <strong><i>"'+CATNAME+'"</i></strong> <a href="#" class="reiniciar">[X]</a>');
					$(".miga").show();
					var post=""
					for(var p = 0; p<total; p++){
						post = '<li data-icon="false">';
						post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
						post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
						post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
						post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
						post += '<p class="breve">'+exito[p].breve+'</p>';
						post += '<p class="tiempo"><i class="icon-time"> '+tiempoLimite(exito[p].fhasta)+'</i> </p>';
						if(exito[p].dias=="Todos"){
							dias = "Todos los días";
						}else{
							dias = exito[p].dias;
						}
						post += '<p class="atributo"><i class="icon-calendar"></i> '+dias+'</p>';
						post += '<p class="tags">';
	        			tinc=pasarArreglo(exito[p].tarjetasId);
	        			for(var mt = 0; mt<tinc.length;mt++){
	        				if($.inArray(tinc[mt],mistarjetasG)){
	        					post +='<span class="tag">'+todastarjetas[tinc[mt]]+'</span>';
	        				}
	        			}
	        			post +='</p></a>';
	        			colorcat = pasarArreglo(exito[p].categoriasID);
	        			//tarjetas incluidas
	        			post +='<span class="catecolor" style="background-color:'+categorias[colorcat[0]]+'"></span>';
	        			post +='</li>';
						$("#dest-home").append(post);
					}
					$("#dest-home").listview( "refresh" );
					$.mobile.loading('hide');
				}else{
					$.mobile.loading('hide');
					$(".miga").html("No se encontraron resultados con <strong><i>"+Q+"</i></strong>");
					$(".miga").show();
				}
			},"json");
			posteos.fail(function(){
				alert('error');
			})
		//}
	})

	/* CONFIGURACIONES */////////////////////////////////////////
	$("#pageconfig").on("pageshow", function(event){		
        $("#pageconfig .error").hide();
        $("#pageconfig .good").hide();
	})
	$("#guardarconf").click(function(){
        $.mobile.changePage('#pagehome');
		// var porcentajes = [];
		// $(".medidor").each(function(index){
		// 	var ID = $(this).attr('data-val');
		// 	porcentajes.push({id:ID,porcentaje:$(this).val()});
		// })
		// var jqhrx = $.post(RUTA+"tarjetas/porcentajes",{user:userID,porcen:porcentajes},function(exito){
		// 		if(exito=="ok"){
		// 			$("#pageconfig .good").show();
		// 			$.mobile.loading('hide');
		// 		}else{
		// 			alert("error");
		// 		}
		// 	})
		// 	jqhrx.fail(function(){
		// 		alert('No se pudo guardar la información. Verifique su conexión a internet');
		// 	})
	})

	$("#pageregistro").on( "pageshow", function(event) {
	/* REGISTRO DE USUARIO *//////////////////////////////////////
	    $("#registrar").click(function(){
	        $("#erterminos").empty();
	        $("#ernombre").empty();
	        $("#erapellido").empty();
	        $("#eremail").empty();
	        $("#erpass").empty();
	        var Nombre = $("#nombre").val();
	        var Apellido = $("#apellido").val();
	        var Email = $("#emailreg").val();
	        var Pass = $("#passreg").val();
	        var sexo = "";
	        var Terminos = 0;
	        var seudonimo = Email.split("@");
	        seudonimo = seudonimo[0];
	        var er = 0;
	        if($("#terminos-1a").prop("checked")==true && $("#terminos-1b").prop("checked")==true){
	            Terminos = 2;
	        }else if($("#terminos-1a").prop("checked")!=true){
	            Terminos = 1;
	        }else{
	            er++;
	            $("#erterminos").html("Para registrarse debe aceptar los términos y condiciones");
	        }
	        if(Nombre == ""){
	            er++;
	            $("#ernombre").html("Campo obligatorio");
	        }
	        if(Apellido == ""){
	            er++;
	            $("#erapellido").html("Campo obligatorio");
	        }
	        if(Email == ""){
	            er++;
	            $("#eremail").html("Campo obligatorio");
	        }else{
	            if(!validar_email(Email)){
	                er++;
	                $("#eremail").html("El e-mail ingresado no contiene un formato válido.");
	            }
	        }
	        $( "select[name='sexo'] option:selected" ).each(function() {
	            sexo=$(this).val();
	        });
	        if(Pass == ""){
	            er++;
	            $("#erpass").html("Campo obligatorio");
	        }
	        if(er<1){
	            $.mobile.loading( 'show', {
	                            text: 'Registrando',
	                            textVisible: true,
	                            theme: 'a',
	                            html: ""
	            });
	            var datos = [];
	            datos.seudonimo = seudonimo;
	            datos.nombre = Nombre;
	            datos.apellido = Apellido;
	            datos.email = Email;
	            datos.uid = "";
	            datos.token = "";
	            datos.sexo = sexo;
	            datos.pass = Pass;
	            datos.terminos = Terminos;
	            
	            registro(datos);
	        }
	    })
	})
///////////*FIN DE REGISTRO*///////////////////////////////////
   function registro(datos){
    $.mobile.loading( 'show', {
                text: 'Enviando',
                textVisible: true,
                theme: 'a',
                html: ""
                });
        $.post(RUTA+"/registro/nuevo",{guardar:1,username:datos.seudonimo,nombre:datos.nombre,apellido:datos.apellido,emailreg:datos.email,uid:datos.uid,token:datos.token,sexo:datos.sexo,passReg:datos.pass,terminos:datos.terminos},function(exito){
                if(exito){
                    if(exito!=""){ 
                        switch(exito){
                            case "ER101":
                                 $("#ernombre").html("Campo obligatorio");
                                 $.mobile.loading('hide');
                                alert("Complete los campos obligatorios");
                            break;
                            case "ER102":
                                 $("#erapellido").html("Campo obligatorio");
                                 $.mobile.loading('hide');
                                 alert("Complete los campos obligatorios");
                            break;
                            case "ER103":
                                 $("#eremail").html("El e-mail ya se encuentra registrado");
                                 $.mobile.loading('hide');
                                 alert("El e-mail ya se encuentra registrado");
                            break;
                            default:
                            window.localStorage.setItem("userID",exito);
                            window.localStorage.setItem("userName",datos.seudonimo);
                            userID = exito;
                            userName = datos.seudonimo;
                            $("#nameuser").html(userName);

                            $("#nombre").val("");
                            $("#apellido").val("");
                            $("#emailreg").val("");
                            $("#passreg").val("");
                            $("#terminos-1a").prop("checked",true);
                            $("#terminos-1b").prop("checked",true);
                            $.mobile.loading('hide');
                            $.mobile.changePage("#pagetarjetas");
                            break;
                        }
                    }
                    $.mobile.loading('hide');
                }
            })
    }
    /*Login*///////////////////////////////////
   $("#login").click(function(){
     $.mobile.loading( 'show', {
                            text: 'Autenticando',
                            textVisible: true,
                            theme: 'a',
                            html: ""
        });
        var Email = $("#email").val();
        var Pass = $("#pass").val();
        if(email!="" && pass !=""){
	        if(!validar_email(Email)){
	            $("#erlogin").html("El formato del e-mail no es válido");
	            $.mobile.loading('hide');
	        }else{
				var jqhrx = $.post(RUTA+"login/service",{enviar:1,email:Email,pass:Pass},function(exito){
	                if(exito){
	                    console.log(exito);
	                        if(exito.error){
	                                switch(exito.error){
	                                    case "ER101":
	                                        $("#erlogin").html("Ingrese el E-mail");
	                                        $.mobile.loading('hide');
	                                    break;
	                                    case "ER102":
	                                        $("#erlogin").html("Ingrese la contraseña");
	                                        $.mobile.loading('hide');
	                                    break;
	                                    case "ER103":
	                                        $("#erlogin").html("Error. Compruebe que el e-mail y la contraseña sean los correctos.");
	                                        $.mobile.loading( 'hide');
	                                    break;
	                                    case "ER104":
	                                        $("#erlogin").html("El e-mail no se encuentra registrado");
	                                        $.mobile.loading('hide');
	                                    break;
	                                }
	                            }else{
	                                userID = exito.id;
	                                userName = exito.username;
	                                window.localStorage.setItem("userID",userID);
	                                window.localStorage.setItem("userName",userName);
	                                $("#nameuser").html(userName);
	                                $.mobile.loading( 'hide');
	                                $.mobile.changePage($("#pagehome"))
	                            }
	                        }
	                    },"json");
						jqhrx.fail(function(){
							alert("Problemas con la conexión. Intente nuevamente.");
							$.mobile.loading('hide');
						})
	            }
    	}else{
        	$("#erlogin").html("Complete los datos de login");
    	}
   	});
   //////////*FIN LOGIN*/////////////////////

    /*LOGOUT*////////////////////////////////
   $('.closeSession').click(function(){
        userID = 0;
        userName = "";
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("userName");
        if(window.localStorage.getItem('fConnect')==true){
                //FB.logout(function(response) {

                //});
                //window.localStorage.setItem('fConnect',false);
        }
        $("#email").html("");
        $("#pass").html("");
        $("#erlogin").html("");
        $.mobile.changePage($("#pagelogin"));
   })
   /////////*FIN LOGOUT*///////////////////

   function pasarArreglo(valor){
   		var res = valor.split(",");
   		res.shift();
   		res.pop();
        return res;
   }
   function tiempoLimite(ff){
   		var meses = {"01":" Jan","02":" Feb","03":" Mar","04":" Apr","05":" May","06":" Jun","07":" Jul","08":" Aug","09":" Sep","10":" Oct","11":" Nov","12":" Dec"};
   		diaF = ff.split("-");
   		La_fecha = new Date();
		La_fecha_total = new Date (meses[diaF[1]] +" "+diaF[2]+" 00:00:00:"+diaF[0]);
		segundos = (La_fecha_total - La_fecha) / 1000;
		minutos = segundos /60;
		horas = minutos / 60;
		horas = Math.round (horas);
		dias = horas / 24;
		dias = Math.round (dias);
		if(dias>31){
			res = "Hasta el "+diaF[2]+"/"+diaF[1]+"/"+diaF[0];
		}else{
			res = "Quedan "+dias+" días.";
		}
		return res;
   }
	function validar_email(valor){
    // creamos nuestra regla con expresiones regulares.
        var filter = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
        // utilizamos test para comprobar si el parametro valor cumple la regla
        if(filter.test(valor))
            return true;
        else
            return false;
    }

})