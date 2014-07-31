$(document).ready(function(){
	var RUTA = "http://backend.bigdescuento.com/";
	$( "body>[data-role='panel']" ).panel();
	//Validación de usuario
	var userID = window.localStorage.getItem('userID');
	var userName = window.localStorage.getItem('userName');

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
			if(window.width()>320){
				folder = "xxhdpi";
				foldernum = "240";
				//$('body').css('zoom','3');
			}else{
				folder = "mdpi";
				foldernum = "80";
				//$('body').css('zoom','1');
			}
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
				$("#categorias").append('<li><a href="#pagehome" data-transition="fade"><i class="fa '+exito[c].icono+'"></i> '+exito[c].tag+' </a></li>');
			}
			$("#categorias").trigger('create');
		}
	},"json");
	cates.fail(function(){
		alert("Lo sentimos. Hubo un problema cargando las categorias");
	})

	$("#pagehome").on("pageshow", function(event){
		$("#destacado").show();
		$(".miga").hide();
		$("#dest-home").empty();
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
		var posteos = $.post(RUTA + 'posts/home',{user:userID},function(exito){
			if(!exito.error){
				var total=exito.length;
				var post=""
				for(var p = 0; p<total; p++){
					post = '<li data-icon="false">';
					post += '<span class="promocion" style="background-color:'+exito[p].color+';">'+exito[p].tag+'</span>';
					post += '<a href="#" class="preview" rel="'+exito[p].id+'">';
					post += '<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito[p].imagen+'">';
					post += '<h2 class="titular">'+exito[p].titulo+'</h2>';
					post += '<p class="breve">'+exito[p].mini_descripcion+'</p>';
					post += '<p class="tiempo"><i class="fa fa-clock-o"></i> Quedan 7 días</p>';
					post += '<p class="atributo"><i class="fa fa-map-marker"></i> Florida 971</p>';
					post += '<p class="tags">';
        			post +='<span class="tag">Visa</span><span class="tag">Banco Galicia</span></p></a>';
        			post +='<span class="catecolor" style="background-color:#3db9f9"></span>';
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
	})

	$("#dest-home").on("click",".preview", function(){
		var jqhrx = $.post(RUTA + 'posts/detalle',{id:$(this).attr('rel')},function(exito){
			if(!exito.error){
				$.mobile.changePage('#pagedetalle');
				$("#img-detalle").html('<img src="'+RUTA+'public/assets/posts/'+folder+'/'+exito.imagen+'" width="100%"/>');
				$("#posttitle").html(exito[1]);
				$("#postbreve").html(exito[2]);
				$(".masinfo").html(exito[3]);
			}
		},"json");
		jqhrx.fail(function(){
			alert("error");
		})		
	})

	//$('#searchinput').click(function(){})
	$("#searchinput").bind( "change", function(event, ui) {
  		if($(this).val()!=""){
  			$("#destacado").hide();
  			$("#dest-home").empty();
  			$.mobile.loading( 'show', {
                text: 'Buscando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
  			var Q = $(this).val();
  			var posteos = $.post(RUTA + 'posts/busqueda',{q:Q,user:userID},function(exito){
			if(!exito.error){
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
					post += '<p class="breve">'+exito[p].mini_descripcion+'</p>';
					post += '<p class="tiempo"><i class="fa fa-clock-o"></i> Quedan 7 días</p>';
					post += '<p class="atributo"><i class="fa fa-map-marker"></i> Florida 971</p>';
					post += '<p class="tags">';
        			post +='<span class="tag">Visa</span><span class="tag">Banco Galicia</span></p></a>';
        			post +='<span class="catecolor" style="background-color:#3db9f9"></span>';
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
	
	$(".tarjetas").on("click",".tarjeta", function(){
			if($(this).hasClass('seleccionado')){
				$(this).removeClass('seleccionado');
				$(this).find("span").remove();
			}else{
				$(this).addClass('seleccionado');
				$(this).append('<span class="activo"><i class="fa fa-check-square-o"></i></span>');
			}
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
				//alert(exito);
				var tottar=exito.tarjetas.length
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
					if(exito.tarjetas[a].icono != ""){
						tag = '<img src="'+RUTA+'public/assets/tarjetas/'+foldernum+'/'+exito.tarjetas[a].icono+'" width="80" height="80" />';
					}else{
						tag = exito.tarjetas[a].tag;
					}
					$("#tarjetas").append('<div class="tarjeta'+medio+'" data-id="'+exito.tarjetas[a].id+'">'+tag+'</div>')
				}
				//alert("Tarjetas OK");
				var totbanc=exito.bancos.length
				//alert("Total Bancos"+totbanc);
				//alert("BANCOS="+JSON.stringify(exito.bancos));
				var tag2="";
				var medio2 = "";
				var counter2 = 0;
				for(var b=0;b<totbanc;b++){
					//alert("FOR Bancos1"+b);
					//alert(exito.tarjetas[a].id);
					if(counter2==1){
						medio2 = " medio";
						counter2++;
					}else{
						medio2 = "";
						counter2++;
					}
					if(counter2==3){
						counter2 = 0;
					}
					if(exito.bancos[b].icono != ""){
						//alert("FOR Bancos2"+b);
						tag2 = '<img src="'+RUTA+'public/assets/tarjetas/'+foldernum+'/'+exito.bancos[b].icono+'" width="80" height="80" />';
					}else{
						//alert("FOR Bancos3"+b);
						tag2 = exito.bancos[b].tag;
					}
					$("#bancos").append('<div class="tarjeta'+medio2+'" data-id="'+exito.bancos[b].id+'">'+tag2+'</div>')
					//alert("FOR Bancos4"+b);
				}
				//alert("Bancos OK");
				$.mobile.loading( 'hide');
				//alert("Se escondió");
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
			alert("error");
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

		$(".guardar").click(function(){
			$.mobile.loading( 'show', {
                text: 'Guardando',
                textVisible: true,
                theme: 'a',
                html: ""
        	});
			var userselect=new Array();
			$('.tarjeta').each(function(index){
				if($(this).hasClass('seleccionado')){
					userselect.push($(this).attr('data-id'));
				}
			})
			var jqhrx = $.post(RUTA+'tarjetas/setusuario',{userid:userID,tarjetas:userselect},function(exito){
				if(exito=="ok"){
					//hacer algo
					$.mobile.changePage('#pageconfig');
					$.mobile.loading('hide');
				}else{
					alert("error");
					$.mobile.loading('hide');
				}
			});
			jqhrx.fail(function(){
				alert("Error en conexión. Vuelva a intentarlo");
				$.mobile.loading('hide');
			})
			//alert(userselect);
		})

	})

	/* CONFIGURACIONES */////////////////////////////////////////
	$("#pageconfig").on("pageshow", function(event){
		$.mobile.loading( 'show', {
                text: 'Cargando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
        $("#pageconfig .error").hide();
        $("#pageconfig .good").hide();
		var consulta = $.post(RUTA+"tarjetas/vinculadas",{userid:userID},function(dato){
					if(dato){
						var dt = dato.length;
						var paste;
						if(dt>0){
						for(var d = 0; d < dt; d++){
							paste += '<tr>';
							paste += '<td width="80px"><img src="'+RUTA+'public/assets/tarjetas/'+foldernum+'/'+dato[d].icono+'" width="70" height="70" /></td>';
							paste += '<td>';
            				paste += '<div data-role="fieldcontain" data-controltype="slider">';
              				paste += '<input id="slider1" class="medidor" data-val="'+dato[d].id+'" type="range" name="slider" value="'+dato[d].porcentaje+'" min="0" max="100" data-highlight="true" data-mini="true">';
            				paste += '</div></td>';
      						paste += '</tr>';
							//alert($(".tarjetas [data-id="+dato[d].id+"]"));
						}	
							$("#medidores").html(paste);
							$("#medidores").trigger('create');
						}else{
							$("#pageconfig .error").show();
						}
						$.mobile.loading('hide');
					}
				},"json");
				consulta.fail(function(){
					alert("ERROR");
					$.mobile.loading('hide');
				})
		
	})
	$("#guardarconf").click(function(){
		$.mobile.loading( 'show', {
                text: 'Guardando',
                textVisible: true,
                theme: 'a',
                html: ""
        });
		var porcentajes = [];
		$(".medidor").each(function(index){
			var ID = $(this).attr('data-val');
			porcentajes.push({id:ID,porcentaje:$(this).val()});
		})
		var jqhrx = $.post(RUTA+"tarjetas/porcentajes",{user:userID,porcen:porcentajes},function(exito){
				if(exito=="ok"){
					$("#pageconfig .good").show();
					$.mobile.loading('hide');
				}else{
					alert("error");
				}
			})
			jqhrx.fail(function(){
				alert('No se pudo guardar la información. Verifique su conexión a internet');
			})
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