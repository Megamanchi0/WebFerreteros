let productosSeleccionados = [];
let productos = [];
let clienteId;
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");

    validarSesion();

    $("#btn-buscar").on("click", () => {
        buscarCliente();
    });

    llenarComboTipoProducto();
    $("#cmbTipoProducto").on("change", async () => {
        await llenarComboProducto();
        llenarValorUnitario();
    });

    $("#btn-agregar").on("click", () => {
        agregarProducto();
    });

    $("#btnPrestamo").on("click", () => {
        realizarPrestamo();
    });

    $("#cmbProducto").on("change", () => {
        llenarValorUnitario();
    });

    $("#btnLimpiar").on("click", () => {
        limpiar();
    });

    $("#btnHistorial").on("click", () => {
        consultarHistorialPrestamos();
    });

    validarFecha();

});

function validarFecha() {
    var manana = new Date();
    manana.setDate(manana.getDate() + 1);
    var fechaManana = manana.toISOString().split('T')[0];
    $('#txtFechaRetorno').attr('min', fechaManana);
}

function validarSesion() {
    var idEmpleado = sessionStorage.getItem("idEmpleado");
    if (!idEmpleado || idEmpleado==0) {
        window.location.href = "Login.html";
    }
}

function limpiar() {
    $("#txtDocumento").val("");
    $("#txtNombre").val("");
    $("#txtCantidad").val("");
    $("#txtFechaRetorno").val("");
    $("#txtValorUnitario").val("");
    $("#txtSubtotal").val("");
    $("#txtTotal").val("");
    $(".datosPrestamo").css("display", "none");
    $(".historial").css("display", "none");
    productosSeleccionados = [];
}

async function buscarCliente() {
    const numero_documento = $("#txtDocumento").val();

    try {
        const datosIn = await fetch("http://localhost:56112/api/Cliente?docCli=" + numero_documento,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();
        if (rpta && rpta.length>0) {
            $(".datosPrestamo").css("display", "block");

            $("#txtNombre").val(rpta[0].NombreCliente);
            clienteId = rpta[0].CodigoCliente;
            
        } else {
            alert("El cliente no fue encontrado");
        }
    }
    catch (error) {
        console.log(error);
        alert("Error:", error);
    }
}

function agregarProducto() {
    const producto = productos.find(p => p.codigo == $("#cmbProducto").val());
    const cantidad = $("#txtCantidad").val()
    const fecha_retorno = $("#txtFechaRetorno").val();
    productosSeleccionados.push({
        producto,
        cantidad,
        fecha_retorno
    });
    let subtotal = $("#txtSubtotal").val();
    if (!subtotal) {
        subtotal = 0;
    }
    const diferenciaMilisegundos = new Date(fecha_retorno) - new Date();
    const diasPrestamo = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    console.log(diferenciaMilisegundos);
    subtotal = +subtotal + producto.valor_dia * cantidad * diasPrestamo;
    $("#txtSubtotal").val(subtotal);
    $("#txtTotal").val(subtotal*1.19);
}

function llenarValorUnitario() {
    const valor = productos.find(p => p.codigo == $("#cmbProducto").val()).valor_dia;
    console.log(valor);
    $("#txtValorUnitario").val(valor);
    
}

function llenarComboTipoProducto() {
    llenarComboGral("http://localhost:56112/api/TipoProducto", "#cmbTipoProducto", "nombre_tipoproducto")
        .then(async () => {
            await llenarComboProducto();
            llenarValorUnitario();
        });
}

async function llenarComboProducto() {
    const tipoprod = $("#cmbTipoProducto");
    try {
        const Respuesta = await fetch("http://localhost:56112/api/Producto?idTipoProducto=" + tipoprod.val(),
            {
                method: "GET",
                mode: "cors",
                headers: { "content-type": "application/json", }
            }
        );
        const Rpta = await Respuesta.json();
        productos = await [...Rpta];
        console.log(productos);
        //Recorrer la respuesta en Rpta, para agregarla al combo de tipo de producto
        $("#cmbProducto").empty();
        //Se recorre la respuesta
        for (i = 0; i < Rpta.length; i++) {
            $("#cmbProducto").append('<option value=' + Rpta[i].codigo + '>' + Rpta[i].descripcion + '</option>');
        }

        //Tener muy encuenta los nombres de los campos, deben ser iguales
        return "Termino";
    }
    catch (error) {
        return error;
    }
}

async function realizarPrestamo() {
    const datosPrestamo = {
        fecha: new Date(),
        subtotal: $("#txtSubtotal").val(),
        valor_total: $("#txtTotal").val(),
        id_cliente: clienteId,
        id_empleado: sessionStorage.getItem("idEmpleado")
    }
    try {
        const datosIn = await fetch("http://localhost:56112/api/Prestamo",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosPrestamo),
            }); //stringify()convierte un objeto o valor de javascrip en una cadena de texto JSON
        const rpta = await datosIn.json();

        const idPrestamo = await rpta.codigo;

        for (const e of productosSeleccionados) {
            datosDetallePrestamo = {
                cantidad: e.cantidad,
                valor_unitario: e.producto.valor_dia,
                fecha_retorno: e.fecha_retorno,
                porcentaje_iva: 0.19,
                retornado: false,
                id_producto: e.producto.codigo,
                id_prestamo: idPrestamo,
                porcentaje_descuento: 0
            };

            try {
                const datosIn = await fetch("http://localhost:56112/api/DetallesPrestamo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(datosDetallePrestamo),
                });
                const rpta = await datosIn.json();
                // Aquí puedes manejar la respuesta si es necesario
            } catch (e) {
                console.log(e);
            }
        }
        
        alert("Prestamo realiazado exitosamente");
        limpiar();
    }
    catch (error) {
        alert("Error:", error.message);
    }

}

function consultarHistorialPrestamos() {
    $(".historial").css("display", "block");
    llenarTablaGral("http://localhost:56112/api/Prestamo?comando=1&parametro=" + clienteId, "#tablaDatos");
}