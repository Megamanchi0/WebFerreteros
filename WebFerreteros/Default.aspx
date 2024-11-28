<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebFerreteros.Default" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inicio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="Paginas/Estilos/EstilosGlobales.css">
  <link rel="stylesheet" href="Paginas/Estilos/Inicio.css">

</head>
<body>
  <div class="container col-md-8 my-5 mx-auto">
    <form id="form2" runat="server">
        <h3 class="text-center">Los Torres Ferreteros S.A.S</h3>
        <div class="text-center">
          <img class="my-3 rounded-circle" src="../Imagenes/logotipo.jpg" alt="Logotipo">
        </div>

        <div class="my-4 text-center">
          <h4>Integrantes</h4>
          <h6>Alejandro Castro Velásquez</h6>
          <h6>Jhonatan Toro Hurtado</h6>

          <h5 class="mt-4">Fecha:</h5>
          <h6>28 de Noviembre de 2024</h6>
        </div>
        <asp:ScriptManager ID="ScriptManager2" runat="server" />
        <asp:Timer ID="Timer2" runat="server" Interval="2500" OnTick="Timer1_Tick" />
    </form>
  </div>

  <script src="Scripts/jquery-3.7.0.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>

