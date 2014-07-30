$(document).ready(function(){
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
   ///////////*FIN DE REGISTRO*///////////////////////////////////
   function registro(datos){
    $.mobile.loading( 'show', {
                text: 'Enviando',
                textVisible: true,
                theme: 'a',
                html: ""
                });
        $.post("http://localhost/bigdesc/backend/registro/nuevo",{guardar:1,username:datos.seudonimo,nombre:datos.nombre,apellido:datos.apellido,emailreg:datos.email,uid:datos.uid,token:datos.token,sexo:datos.sexo,passReg:datos.pass,terminos:datos.terminos},function(exito){
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
                            $("#nombre").val("");
                            $("#apellido").val("");
                            $("#emailreg").val("");
                            $("#passreg").val("");
                            $("#terminos-1a").prop("checked",true);
                            $("#terminos-1b").prop("checked",true);
                            $.mobile.loading('hide');
                            $.mobile.navigate("home.html");
                            break;
                        }
                    }
                    $.mobile.loading('hide');
                }
            })
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