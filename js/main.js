function main(){
	$.mobile.loading( 'show', {
                  text: 'Autenticando Usuario',
                  textVisible: true,
                  theme: 'a',
                  html: ""  
    });
	 if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Error. Vuelva a intentarlo1');
            if (typeof CDV == 'undefined') alert('Error. Vuelva a intentarlo2');
            if (typeof FB == 'undefined') alert('Error. Vuelva a intentarlo3');
            
            FB.Event.subscribe('auth.login', function(response) {
                               //alert('auth.login event');
                               //alert("ya esta logeado");
                               //me();
                               });
            
            FB.Event.subscribe('auth.logout', function(response) {
                               //alert('auth.logout event');
                               });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                               //alert('auth.sessionChange event');
                               });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                               //alert('auth.statusChange event');
                               });
    FB.init({ appId: "853919827954063", nativeInterface: CDV.FB, useCachedDialogs: false });
	
	
	/*PRIMERAS CONFIGURACIONES DE HTML */
	$( "body>[data-role='panel']" ).panel();
	$('a.addfav').attr('data-icon','star');
	$('a.addfav').buttonMarkup({ icon: "star" });
	$("a.addfav").html("Agregar a favoritos");
	/*////////////////*/
	var RUTA = "http://backend.bigdescuento.com/"; //192.168.0.109
	
	/*Datos de usuario///////////////////////////////////*/
	var userID = window.localStorage.getItem('userID');
	var userName = window.localStorage.getItem('userName');
	var mistarjetasG = new Array();
	var usernotifi = "";
	var fconnect = window.localStorage.getItem("fConnect");
	/*//////////////////////////////////////////////////*/

	var categorias = new Array();
	var todastarjetas = new Array();
	var tarjetasURLS = new Array();
	var detalleID = 0;
	var vuelvoDeDetalle = false;
	var limitePosts=10;
	var CAT = 0;
	var CATNAME="";

	/*Validación de usuario//////////////////////////////*/
	if(userID>0){
		if($.mobile.activePage[0].id){
			$("#nameuser").html(userName);
			$.mobile.changePage('#pagehome');
        	if(channelUri!=""){
            	var jqxhr = $.post(RUTA + 'channels/nuevo',{code:channelUri,usuario:userID},function(exito){})
        	}
		}
	}else{
		$.mobile.changePage('#pagelogin');
		$.mobile.loading('hide');
	}
	/*//////////////////////////////////////////////////*/

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

	$("#pagehome").on("pageshow", function(event){
		if(vuelvoDeDetalle==false){
			traerHome();
		}
	})
	
	function tarjetas(){
		var tar = $.post(RUTA + 'tarjetas/todas',{user:userID},function(exito){
				if(exito){
				tot = exito.todas.length;
				for(var e=0;e<tot;e++){
					//alert(exito.todas[e].id+" = "+exito.todas[])
					todastarjetas[exito.todas[e].id]=exito.todas[e].tag;
					tarjetasURLS[exito.todas[e].id] = exito.todas[e].urlb;
				}
				tot = exito.mias.length;
				for(var y=0;y<tot;y++){
					mistarjetasG.push(exito.mias[y].tag_id);
				}
				//alert(mistarjetasG);
				$.mobile.loading('hide');
					}
				},"json")
	}

	function traerHome(){
		$("#searchmore").hide();
		$("#destacado").show();
		$(".miga").hide();
		$("#dest-home").empty();
		if(categorias.length>0){
			tarjetas();
		}else{
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
					tarjetas();
				}
				},"json");
				cates.fail(function(){
					$.mobile.loading('hide');
					alert("Lo sentimos. Hubo un problema cargando las categorias");
			})
		}
	
		//TRAER BANNER
		$("#destacado").html('<i class="fa fa-spinner fa-spin"></i>');
		
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
        				if(enArray(mistarjetasG,tinc[mt])){
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
				traerBanner();
			}else{
				$.mobile.changePage('#pagetarjetas');
			}
		},"json");
		posteos.fail(function(){
			$.mobile.changePage('#pagetarjetas');
		})
		vuelvoDeDetalle=false;
	}

	function traerBanner(){
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
		$('.addfav').attr('data-icon','star');
		$('.addfav').buttonMarkup({ icon: "star" });
		$(".addfav").html("Agregar a favoritos");
		$.mobile.loading( 'show', {
                text: 'Cargando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
		var chfav=$.post(RUTA + 'favoritos/existe',{id:detalleID,user:userID},function(exito){
			if(exito=="si"){
				$('.addfav').attr('data-icon','delete');
				$('.addfav').buttonMarkup({ icon: "delete" });
				$(".addfav").html("Eliminar de favoritos");
			}else{
				$('.addfav').attr('data-icon','star');
				$('.addfav').buttonMarkup({ icon: "star" });
				$(".addfav").html("Agregar a favoritos");
			}
		});
		chfav.fail(function(){
			$('a.addfav').attr('data-icon','star');
			$('a.addfav').buttonMarkup({ icon: "star",iconpos:"center" }).button('refresh');
			$("a.addfav").html("Agregar a favoritos");
		})
		var jqhrx = $.post(RUTA + 'descuentos/detalle',{id:detalleID},function(exito){
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
				$("#exppromo").html(urlify(exito.masinfo));
				$("#detTags").empty();
				tinc=pasarArreglo(exito.tarjetasId);
        		for(var mt = 0; mt<tinc.length;mt++){
        				if(enArray(mistarjetasG,tinc[mt])){
        					var url = tarjetasURLS[tinc[mt]];
        					if(url==""){url="#"};
        					var enlace = '<a href="#" ';
        						if(url!="#"){
        							enlace += 'onclick="window.open(';
        							enlace += "'" + url + "', '_system');";
									enlace += '" ';
								}
								enlace += '>';
        					$("#detTags").append('<span class="tag">'+enlace+todastarjetas[tinc[mt]]+'</a></span>');
        				}else{
        					$("#detTags").append('<span class="tag nohay">'+todastarjetas[tinc[mt]]+'</span>');
        				}

        		}
        		$(".masinfo").html("<br>"+exito.descripcion);
        		$.mobile.loading('hide');
			}
		},"json");
		jqhrx.fail(function(){
			alert("error");
		})		
	})
	
	//FUNCION BUSQUEDA
	function buscador(INIT){
		$.mobile.loading( 'show', {
                text: 'Buscando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
  			var Q = $("#searchinput").val();
  			var posteos = $.post(RUTA + 'descuentos/busqueda',{q:Q,user:userID,desde:INIT,hasta:limitePosts},function(exito){
			if(!exito.error){
				var total=exito.length;
				$("#searchmore").show();
				$("#searchmore").attr('data-inicio',INIT);
				$("#searchmore").attr('data-act','search');
				$("#searchmore").attr("disabled", false);
				if(total<limitePosts){
					$("#searchmore").attr("disabled", true);
				}
				if(INIT==0){
					$(".miga").html(total+' descuentos de <strong><i>"'+Q+'"</i></strong> <a href="#" class="ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all reiniciar" title="Reiniciar">Reiniciar</a>');
					$(".miga").show();
				}
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
        				if(enArray(mistarjetasG,tinc[mt])){
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
				if(INIT==0){
					$(".miga").html("No se encontraron resultados con <strong><i>"+Q+"</i></strong> <a href='#' class='ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all reiniciar' title='Reiniciar'>Reiniciar</a>");
					$(".miga").show();
				}else{
					$("#dest-home").append('<li>No se encontraron más promociones</li>');
					$("#searchmore").attr("disabled", true);
				}
			}
		},"json");
		posteos.fail(function(){
			alert('error');
		})
  	}
	
	//$('#searchinput').click(function(){})
	$("#searchinput").bind( "change", function(event, ui) {
		//alert("Change");
  		if($(this).val()!=""){
  			$("#destacado").hide();
  			$("#dest-home").empty();
  			buscador(0);
  		}
	});
	
	$("#searchmore").click(function(){
		var inicio = $(this).attr('data-inicio');
		inicio = inicio + 10;
		$(this).attr('data-inicio',inicio);
		if($(this).attr('data-act')=='search'){
			buscador(inicio);
		}else{
			busquedaCAT(inicio);
		}
	})

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
		$.mobile.loading( 'show', {
                text: 'Cargando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
		$("#favoritos").empty();
		var posteos = $.post(RUTA + 'favoritos/traer',{user:userID},function(exito){
			if(!exito.error){
				var total=exito.length;

				var post=""
				var trans=""
				for(var p = 0; p<total; p++){
					var vence=tiempoLimite(exito[p].fhasta);
					if(vence == "VENCIDO"){
						trans='class="vencido"';
					}else{
						trans='';
					}
					post = '<li data-icon="false" id="ren'+exito[p].id+'" '+trans+'>';
					post += '<span class="favrem" data-id="'+exito[p].id+'"><i class="icon-remove-sign"></i></span>';
					post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
					post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
					post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
					post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
					post += '<p class="breve">'+exito[p].breve+'</p>';

					post += '<p class="tiempo"><i class="icon-time"> '+vence+'</i> </p>';
					if(exito[p].dias=="Todos"){
						dias = "Todos los días";
					}else{
						dias = exito[p].dias;
					}
					post += '<p class="atributo"><i class="icon-calendar"></i> '+dias+'</p>';
					post += '<p class="tags">';
        			tinc=pasarArreglo(exito[p].tarjetasId);
        			for(var mt = 0; mt<tinc.length;mt++){
        				if(enArray(mistarjetasG,tinc[mt])){
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
				$.mobile.loading('hide');
			}else{
				$("#favoritos").html('<li>No hay descuentos agregados a favoritos</li>');
				$.mobile.loading('hide');
			}
		},"json");
		posteos.fail(function(){
			alert('error');
			$.mobile.loading('hide');
		})
	})
	$(".addfav").click(function(){
		$(".addfav").html('<i class="icon-spinner icon-spin"></i>');
		if($('.addfav').attr('data-icon')=='star'){
			 $.post(RUTA + 'favoritos/guardar',{user:userID,desc:detalleID},function(exito){
			 	if(exito){
			 		$('a.addfav').attr('data-icon','delete');
			 		$('a.addfav').buttonMarkup({ icon: "delete" });
			 		$("a.addfav").html("Eliminar de favoritos");
			 	}
			 })
		}else{
			$.post(RUTA + 'favoritos/borrar',{fav:detalleID,user:userID},function(exito){
				if(exito != "error"){
					$('a.addfav').attr('data-icon','star');
					$('a.addfav').buttonMarkup({ icon: "star" });
				 	$("a.addfav").html("Agregar a favoritos");
				}else{
					$('a.addfav').attr('data-icon','delete');
					$('a.addfav').buttonMarkup({ icon: "delete" });
				 	$("a.addfav").html("Eliminar de favoritos");
				}
			})
		}
	})
	$("#pagefavoritos").on("click",".favrem",function(){
		var ID = $(this).attr('data-id');
		$.post(RUTA + 'favoritos/borrar',{fav:ID,user:userID},function(exito){
			if(exito != "error"){
				$("#ren"+ID).remove();
			}else{
				alert("Error");
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
					switch(counter){
						case 0:
						medio="";
						counter++;
						break;
						case 1:
						medio=" medio";
						counter++;
						break;
						case 2:
						medio="";
						counter=0;
						break;
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
		$("#searchinput").val("");
		traerHome();
	})

	//Busqueda por categoria
	function busquedaCAT(INIT){

		$.mobile.loading( 'show', {
                text: 'Buscando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
				var posteos = $.post(RUTA + 'descuentos/busquedaCat',{cat:CAT,user:userID,desde:INIT,hasta:limitePosts},function(exito){
				if(!exito.error){
					var total=exito.length;
					$("#searchmore").show();
					$("#searchmore").attr('data-inicio',INIT);
					$("#searchmore").attr('data-act','cat');
					$("#searchmore").attr("disabled", false);
					if(total<limitePosts || total==0 || total==-1){
						$("#searchmore").attr("disabled", true);
					}
					if(INIT==0){
						$(".miga").html(total+' descuentos en <strong><i>"'+CATNAME+'"</i></strong> <a href="#" class="ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all reiniciar" title="Reiniciar">Reiniciar</a>');
						$(".miga").show();
					}
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
	        				if(enArray(mistarjetasG,tinc[mt])){
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
					if(INIT==0){
						$(".miga").html("No se encontraron descuentos en <strong><i>"+CATNAME+"</i></strong> <a href='#' class='ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all reiniciar' title='Reiniciar'>Reiniciar</a>");
						$(".miga").show();
					}else{
						$("#dest-home").append('<li>No se encontraron más promociones</li>');
						$("#searchmore").attr("disabled", true);
					}
				}
			},"json");
			posteos.fail(function(){
				alert('error');
			})
	}

	$("#categorias").on('click','.catfil',function(){
		event.preventDefault();
		CAT=$(this).attr('rel');
		CATNAME =$(this).attr('title');
		var activePage = $.mobile.activePage[0].id;
		//if(activePage == "pagehome" && $("#searchinput").val()!=""){
			//FILTRO LA BÚSQUEDA.
		//}else{
			$("#catespanel").panel("close");
			$("#destacado").hide();
  			$("#dest-home").empty();

  			busquedaCAT(0);
		//}
	})

	/* CONFIGURACIONES */////////////////////////////////////////
	$("#pageconfig").on("pageshow", function(event){		
        $("#pageconfig .error").hide();
        $("#pageconfig .good").hide();
        var est = '';
        if(usernotifi==1){
        	est = 'off';
        }else{
        	est = 'on';
        }
        $("#notificaciones").val(est);
        $("#notificaciones").change();
         $("#notificaciones").slider("refresh", true);

        //$('#notificaciones option[value="' + est + '"]').prop("selected", true);
	})
	$("#guardarconf").click(function(){
		var est = $("#notificaciones").val();
		if(est=='on'){
			usernotifi = 2;
		}else{
			usernotifi = 1;
		}
		var jqhrx = $.post(RUTA + 'registro/notificame',{user:userID,estado:usernotifi},function(exito){

		})
        $.mobile.changePage('#pagehome');		
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
    /*Login FACEBOOK */////////////////////////
    ////////////////////////* FIN SHARE BUTTON */////////////////////////
    $("#fconnect").click(function(){
    	$.mobile.loading( 'show', {
                text: 'Conectando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
        FB.login(
            function(response) {
                if (response.authResponse.session_key) {
                    window.localStorage.setItem("fConnect",true);
                    fconnect = true;
					var jqhrx = $.post(RUTA + '/login/fbuser',{uid:response.authResponse.userId},function(exito){
                                	if(exito){
                                    	if(!exito.error){
                                    		userID = exito.id;
	                                		userName = exito.username;
	                                		usernotifi = exito.terminos;
	                               			window.localStorage.setItem("userID",userID);
	                                		window.localStorage.setItem("userName",userName);
	                                		fconnect = true;
	                                		window.localStorage.setItem("fConnect",true);
	                                		$("#nameuser").html(userName);
	                                		$.mobile.loading( 'hide');
	                                		$.mobile.changePage($("#pagehome"));
	                                		$.mobile.loading('hide');
	                                		 if(channelUri!=""){
                             				 	var jqxhr = $.post(RUTA + 'channels/nuevo',{code:channelUri,usuario:userID},function(exito){})
                            				 }
                                    	}else{
                                        	me();
                                    	}
                                	}
                            	},"json");
					jqhrx.fail(function(){
						alert("error en conexión");
						$.mobile.loading('hide');
					})                          
                } else {
                    alert('Login incompleto.');
                    $.mobile.loading('hide');
                }
            },
            { scope: "email" }
        );
    })
       
    //DATOS MIOS PARA REGISTRO
    function me() {
        FB.api('/me', { fields:'name, email, first_name, last_name, gender' },  function(response) {
            if (response.error) {
                // alert(JSON.stringify(response.error));
            } else {
            var datos = [];
			datos.seudonimo = response.name;
            datos.nombre = response.first_name;
            datos.apellido = response.last_name;
            datos.email = response.email;
            datos.uid = response.id;
            datos.token = "";
            datos.sexo = response.gender;
            datos.pass = "Rj45F";//OCULTAR.
            datos.terminos = 2;
                       //alert(response.name+" "+response.first_name+" "+response.last_name+" "+response.email+" "+response.id+" "+response.gender);
            registro(datos);
            $.mobile.loading('hide');
            }
        });
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
	                                usernotifi = exito.terminos;
	                                window.localStorage.setItem("userID",userID);
	                                window.localStorage.setItem("userName",userName);
	                                $("#nameuser").html(userName);
	                                $.mobile.loading( 'hide');
	                                $.mobile.changePage($("#pagehome"))
	                                 if(channelUri!=""){
                                		var jqxhr = $.post(RUTA + 'channels/nuevo',{code:channelUri,usuario:userID},function(exito){})
                            		 }
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
        usernotifi = 0;
        userName = "";
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("userName");
        if(window.localStorage.getItem('fConnect')==true){
                FB.logout(function(response) {

                });
                window.localStorage.setItem('fConnect',false);
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
			if(dias==0){
				res = "Vence Hoy";
			}else if(dias<0){
				res = "VENCIDO";
			}else{
			res = "Quedan "+dias+" días.";
			}
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

    function enArray(arreglo,dato){
    	for(var r=0;r<arreglo.length;r++){
    		if(arreglo[r]==dato){
    			return true;
    		}
    	}
    	return false;
    }
    function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
    	var enlace = '<a href="#" ';
        enlace += 'onclick="window.open(';
        enlace += "'" + url + "', '_system');";
		enlace += '" ';
		enlace += '>';
        return enlace;
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
	}

}