jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");

    validarSesion()

    llenarComboTipoDocumento();
    llenarComboCargo();
    llenarComboGenero();
    llenarComboDepartamento();
    llenarComboCiudad();

    $("#btnInsertarEmpleado").on("click", () => {
        insertarEmpleado();
    });

    $("#btnActualizarEmpleado").on("click", () => {
        actualizarEmpleado();
    });

    $("#btn-buscar").on("click", () => {
        consultarEmpleado();
    });

    $("#btnImprimir").on("click", () => {
        imprimir();
    });

    modificarFormulario();
    mostrarFormularioUsuario();
    limpiar();
});

function validarSesion() {
    var idEmpleado = sessionStorage.getItem("idEmpleado");
    if (!idEmpleado || idEmpleado == 0) {
        window.location.href = "Login.html";
    }
}

function modificarFormulario() {
    $("#btnActualizar").on("click", () => {
        $(".actualizar").css("display", "block");
        $(".registrar").css("display", "none");
        $(".datos-empleado").css("display", "none");
        $(".usuario").css("display", "none");
        $("#txtDocumento").prop("disabled", true);
        $("#cmbTipoDocumento").prop("disabled", true);
        $("#form-control").val("");
        $(".actualizar-encontrado").css("display", "none");
    });

    $("#btnRegistrar").on("click", () => {
        $(".actualizar").css("display", "none");
        $(".registrar").css("display", "block");
        $(".datos-empleado").css("display", "block");
        $(".actualizar-encontrado").css("display", "none");
        $("#txtDocumento").prop("disabled", false);
        $("#cmbTipoDocumento").prop("disabled", false);
        $(".form-control").val("");
    });
}

function mostrarFormularioUsuario() {
    const checkBox = $("#cbEsUsuario");
    checkBox.on("change", () => {
        if (checkBox.prop("checked") == true) {
            $(".usuario").css("display", "block");
        } else {
            $(".usuario").css("display", "none");
        }
    });
}


function limpiar() {
    $(".limpiar").on("click", () => {
        $("#txtBuscarDocumento").val("");
        $("#cmbTipoDocumento").val("0");
        $("#txtDocumento").val("");
        $("#txtNombre").val("");
        $("#txtFecha").val("");
        $("#cmbCargo").val("0");
        $("#cbmGenero").val("0");
        $("#txtSalario").val("");
        $("#txtTelefono").val("");
        $("#txtDireccion").val("");
        $("#cbmCiudad").val("0");
        $("#txtUsuario").val("");
        $("#txtContrasena").val("");
    });
}

async function insertarEmpleado() {
    let datosEmpleado = {
        nombre: $("#txtNombre").val(),
        numero_documento: $("#txtDocumento").val(),
        numero_telefono: $("#txtTelefono").val(),
        direccion: $("#txtDireccion").val(),
        fecha_nacimiento: $("#txtFecha").val(),
        salario: $("#txtSalario").val(),
        es_usuario: $("#cbEsUsuario").prop("checked"),
        id_empleado: sessionStorage.getItem("idEmpleado"),
        id_cargo: $("#cmbCargo").val(),
        id_genero: $("#cbmGenero").val(),
        id_tipodocumento: $("#cmbTipoDocumento").val(),
        id_ciudad: $("#cbmCiudad").val(),
    };

    try {
        const datosIn = await fetch("http://localhost:56112/api/Empleado",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosEmpleado),
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();

        if (datosEmpleado.es_usuario) {
            const datosUsuario = {
                usuario1: $("#txtUsuario").val(),
                contrasenia: $("#txtContrasena").val()
            }
            console.log(datosUsuario);
            fetch("http://localhost:56112/api/Usuario?documentoEmpleado=" + datosEmpleado.numero_documento,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(datosUsuario)
                });
        }

        alert(rpta);
        limpiar();
    }
    catch (error) {
        alert("Error:", error.message);
    }
}

async function actualizarEmpleado() {
    let datosEmpleado = {
        nombre: $("#txtNombre").val(),
        numero_documento: $("#txtDocumento").val(),
        numero_telefono: $("#txtTelefono").val(),
        direccion: $("#txtDireccion").val(),
        fecha_nacimiento: $("#txtFecha").val(),
        salario: $("#txtSalario").val(),
        es_usuario: $("#cbEsUsuario").prop("checked"),
        id_empleado: 1, //Después se valida con el login
        id_cargo: $("#cmbCargo").val(),
        id_genero: $("#cbmGenero").val(),
        id_tipodocumento: $("#cmbTipoDocumento").val(),
        id_ciudad: $("#cbmCiudad").val(),
        activo: $("#cbActivo").prop("checked")
    };

    try {
        const datosIn = await fetch("http://localhost:56112/api/Empleado",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosEmpleado),
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();
        alert(rpta)
        limpiar();
    }
    catch (error) {
        alert("Error:", error.message);
    }
}

async function consultarEmpleado() {
    const numero_documento = $("#txtBuscarDocumento").val();

    try {
        const datosIn = await fetch("http://localhost:56112/api/Empleado?documentoEmpleado=" + numero_documento,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();
        console.log(rpta)
        if (rpta) {
            $(".datos-empleado").css("display", "block");
            $(".actualizar-encontrado").css("display", "block");

            $("#txtNombre").val(rpta.nombre);
            $("#txtDocumento").val(rpta.numero_documento);
            $("#txtTelefono").val(rpta.numero_telefono);
            $("#txtDireccion").val(rpta.direccion);
            $("#txtFecha").val(rpta.fecha_nacimiento);
            $("#txtSalario").val(rpta.salario);
            $("#cmbCargo").val(rpta.id_cargo);
            $("#cbmGenero").val(rpta.id_genero);
            $("#cmbTipoDocumento").val(rpta.id_tipodocumento);
            $("#cbActivo").prop("checked", rpta.activo);

            try {
                const respuesta = await fetch("http://localhost:56112/api/Departamento?idCiudad=" + rpta.id_ciudad,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                const datos = await respuesta.json();
                console.log(datos);
                $("#cmbDepartamento").val(datos.codigo);
                llenarComboGral("http://localhost:56112/api/Ciudad?idDpto=" + datos.codigo, "#cbmCiudad", "nombre_ciudad");
                console.log(rpta.id_ciudad);
                $("#cbmCiudad").val(rpta.id_ciudad);
            } catch (e) {
                console.log(e);
            }
        } else {
            alert("El empleado no fue encontrado");
        }    
    }
    catch (error) {
        console.log(error);
        alert("Error:", error);
    }
}

function imprimir() {
    var doc = new jsPDF();

    const texto = "Nombre: " + $("#txtNombre").val() + "\n" +
        "Tipo de documento: " + $("#cmbTipoDocumento option:selected").text() + "\n" +
        "Documento: " + $("#txtDocumento").val() + "\n" +
        "Telefono: " + $("#txtTelefono").val() + "\n" +
        "Direccion: " + $("#txtDireccion").val() + "\n" +
        "Fecha de nacimiento: " + $("#txtFecha").val() + "\n" +
        "Salario: " + $("#txtSalario").val() + "\n" +
        "Cargo: " + $("#cmbCargo option:selected").text() + "\n" +
        "Genero: " + $("#cbmGenero option:selected").text() + "\n";

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(texto);
    const x = (pageWidth - textWidth) / 2;
    doc.text(texto, 10, 10);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
}

function llenarComboTipoDocumento() {
    llenarComboGral("http://localhost:56112/api/TipoDocumento", "#cmbTipoDocumento", "nombre_tipodocumento");
}

function llenarComboCargo() {
    llenarComboGral("http://localhost:56112/api/Cargo", "#cmbCargo", "nombre_cargo");
}

function llenarComboGenero() {
    llenarComboGral("http://localhost:56112/api/Genero", "#cbmGenero", "nombre_genero");
}

function llenarComboDepartamento() {
    llenarComboGral("http://localhost:56112/api/Departamento", "#cmbDepartamento", "nombre_departamento")
        .then(() => {
            const departamento = $("#cmbDepartamento");
            llenarComboGral("http://localhost:56112/api/Ciudad?idDpto=" + departamento.val(), "#cbmCiudad", "nombre_ciudad");
        })
        ;
}

function llenarComboCiudad() {
    const departamento = $("#cmbDepartamento");
    departamento.on("change", () => {
        llenarComboGral("http://localhost:56112/api/Ciudad?idDpto=" + departamento.val(), "#cbmCiudad", "nombre_ciudad");
    });
}
