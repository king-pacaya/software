<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario de Cotización</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;700&family=Oswald&family=Ubuntu:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="shortcut icon" href="../multimedia/favicon.png">
</head>
<body>

<?php
// Conexión a la base de datos
$conex = mysqli_connect("161.132.57.223", "vazcmxri_root", "*A-mW5dJ-M", "vazcmxri_cotizacion_registro");

// Verificar la conexión
//if (!$conex) {
//    echo "<h1 style='color: red;'>Error de conexión a la base de datos</h1>";
//} else {
//    echo "<h1 style='color: green;'>Conexión exitosa a la base de datos</h1>";
//}

// Consulta SQL para obtener los datos
$query = "SELECT `id`, `anio`, `cliente`, `total_neto`, `fecha_reg` FROM `cotizaciones` WHERE 1";

// Ejecutar la consulta
$result = mysqli_query($conex, $query);

// Número de cotizaciones por página
$registros_por_pagina = 10;

// Obtener la cantidad de registros a mostrar
$registros_a_mostrar = isset($_GET['registros']) ? $_GET['registros'] : 10;

// Calcular el número total de páginas basado en la cantidad de registros a mostrar
$total_registros = mysqli_num_rows($result);
$total_paginas = ceil($total_registros / $registros_a_mostrar);

// Obtener la página actual o establecerla por defecto
$pagina_actual = (isset($_GET['pagina']) && is_numeric($_GET['pagina'])) ? $_GET['pagina'] : 1;

// Asegurarse de que la página actual no exceda el nuevo número total de páginas
$pagina_actual = min($pagina_actual, $total_paginas);

// Calcular el inicio del conjunto de registros que se mostrarán en la página actual
$inicio_registro = ($registros_por_pagina * ($pagina_actual - 1));

// Consulta SQL con limit y offset para obtener los registros de la página actual
$query_paginacion = "SELECT `id`, `anio`, `cliente`, `total_neto`, `fecha_reg` FROM `cotizaciones` LIMIT $inicio_registro, $registros_a_mostrar";
$result_paginacion = mysqli_query($conex, $query_paginacion);
?>

<!-- Aquí comienza la estructura HTML -->

<div class="container">
    <h1>Inventario de Cotización</h1>

    <div class="dropdown">    
        <!-- Dropdown para seleccionar la cantidad de cotizaciones a mostrar -->
        <?php
        echo "<label for='cantidadRegistros'>Mostrar:</label>";
        echo "<select id='cantidadRegistros' onchange='cambiarCantidadRegistros()'>";

        // Opciones del dropdown
        $opciones = [10, 30, 50];
        foreach ($opciones as $opcion) {
            // Establecer la opción seleccionada si coincide con la cantidad actual de registros
            $seleccionado = ($opcion == $registros_a_mostrar) ? "selected" : "";
            echo "<option value='$opcion' $seleccionado>$opcion</option>";
        }

        echo "</select>";
        ?>
    </div>

    <div class="pagcont">
        <!-- Botones de siguiente y atrás -->
        <div>
            <?php
            if ($pagina_actual > 1) {
                echo "<a class='pagb' href='?pagina=".($pagina_actual - 1)."&registros=$registros_a_mostrar'><i class='bi bi-caret-left-fill'></i></a> ";
            }
            ?>
        </div>

        <!-- Paginación -->
        <div>
            <?php
            // Mostrar enlaces de paginación
            for ($i = 1; $i <= $total_paginas; $i++) {
                echo "<a class='paga' href='?pagina=$i&registros=$registros_a_mostrar'>$i</a> ";
            }
            ?>
        </div>

        <!-- Botones de siguiente y atrás -->
        <div>
            <?php
            if ($pagina_actual < $total_paginas) {
                echo "<a class='pagn' href='?pagina=".($pagina_actual + 1)."&registros=$registros_a_mostrar'><i class='bi bi-caret-right-fill'></i></a> ";
            }
            ?>
        </div>
    </div>

    <!-- Tabla para mostrar las cotizaciones -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Año</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Total Neto</th>
                <th>Documento</th>
            </tr>
        </thead>
        <tbody>
            <?php
            // Mostrar los registros obtenidos de la base de datos
            while ($row = mysqli_fetch_assoc($result_paginacion)) {
                echo "<tr>";
                echo "<td>{$row['id']}</td>";
                echo "<td>{$row['anio']}</td>";
                echo "<td>{$row['cliente']}</td>";
                echo "<td>{$row['fecha_reg']}</td>";
                echo "<td>{$row['total_neto']}</td>";
                echo "<td><button onclick='verDocumento({$row['id']})'><i class='bi bi-filetype-pdf'></i></button></td>";
                echo "</tr>";
            }
            ?>
        </tbody>
    </table>
</div>

<script>
    function cambiarCantidadRegistros() {
        // Obtener el valor seleccionado del dropdown
        var cantidad = document.getElementById("cantidadRegistros").value;

        // Redirigir a la página actual con el nuevo valor de registros por página
        var paginaActual = <?php echo $pagina_actual; ?>;
        window.location.href = "?pagina=" + paginaActual + "&registros=" + cantidad;
    }
    function verDocumento(id) {
        // Redirigir a la página que muestra los detalles de la cotización con el ID proporcionado
        window.location.href = "/cotizacion/ver_cotizacion.php?id=" + id;
    }
</script>
</body>
</html>
