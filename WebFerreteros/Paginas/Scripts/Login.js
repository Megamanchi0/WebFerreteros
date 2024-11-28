jQuery(function () {
    $("#btnIniciarSesion").on("click", () => {
        iniciarSesion();
    });
});

async function iniciarSesion() {
    const datosUsuario = {
        usuario: $("#txtUsuario").val(),
        contrasenia: $("#txtContrasena").val(),
    }
    try {
        const datosIn = await fetch("http://localhost:56112/api/Usuario",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosUsuario),
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();

        sessionStorage.setItem("idEmpleado", rpta);

        if (rpta == 0) {
            alert("Credenciales incorrectas");
        }
        else {
            window.location.href = "Empleado.html";
        }
    }
    catch (error) {
        alert("Error:", error.message);
    }
}