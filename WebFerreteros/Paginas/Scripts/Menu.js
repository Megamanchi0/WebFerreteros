jQuery(function () {

    validarSesion();
    $("#btnCerrarSesion").on("click", () => {
        cerrarSesion();
    });
});

function cerrarSesion() {
    sessionStorage.removeItem("idEmpleado");
    window.location.href = "Login.html";
    
}

function validarSesion() {
    var idEmpleado = sessionStorage.getItem("idEmpleado");
    if (!idEmpleado || idEmpleado == 0) {
        $(".logged").css("display", "none");
        $(".not-logged").css("display", "inline");
    } else {
        $(".logged").css("display", "inline");
        $(".not-logged").css("display", "none");
    }
}