<!DOCTYPE html>
<html>
<head>
    <title>Detalles de Cotización</title>
    <meta charset="UTF-8">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;700&family=Oswald&family=Ubuntu:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="shortcut icon" href="multimedia/favicon.png">
    <link rel="stylesheet" type="text/css" href="ver_cotizacion.css">
</head>
<body>
    <?php
    // Conexión a la base de datos
    $conex = mysqli_connect("161.132.57.223", "vazcmxri_root", "*A-mW5dJ-M", "vazcmxri_cotizacion_registro");

    // Verificar la conexión
//    if (!$conex) {
//        echo "<h1 style='color: red;'>Error de conexión a la base de datos</h1>";
//    } else {
//        echo "<h1 style='color: green;'>Conexión exitosa a la base de datos</h1>";
//    }

    // Obtener el ID de la cotización
    $cotizacion_id = $_GET['id'];

    // Consulta para obtener los datos de la cotización, incluyendo el año
    $consulta_cotizacion = "SELECT *, YEAR(fecha_reg) AS anio FROM cotizaciones WHERE id = $cotizacion_id";
    $resultado_cotizacion = mysqli_query($conex, $consulta_cotizacion);
    $fila_cotizacion = mysqli_fetch_assoc($resultado_cotizacion);

    // Consulta para obtener los detalles de la cotización
    $consulta_detalles = "SELECT * FROM detalles_cotizacion WHERE cotizacion_id = $cotizacion_id";
    $resultado_detalles = mysqli_query($conex, $consulta_detalles);

    // Datos de contacto de la empresa
    $contactos = array(
        "victor.carerra@inascmec.com.pe",
        "jose.carrera@inascmec.com.pe",
        "alexis.roca@inascmec.com.pe"
    );

    // Obtener los detalles de la cotización y almacenarlos en un array
    $detalles_cotizacion = array();
    while ($fila_detalle = mysqli_fetch_assoc($resultado_detalles)) {
        $detalles_cotizacion[] = $fila_detalle;
    }

    // Iniciar sesión para almacenar los detalles de la cotización en una variable de sesión
    session_start();
    $_SESSION['detalles_cotizacion'] = $detalles_cotizacion;
    ?>

    <div class="header">
        <p>INASMEC S.A.C</p>
    </div>

    <div class="details_container">
        <div class="block">
            <div class="cotizacion_id">
                <p>Cotización</p>
                <p>N° <?php echo str_pad($cotizacion_id, 4, '0', STR_PAD_LEFT) . "-" . $fila_cotizacion['anio']; ?></p>
            </div>
            <div class="contacto">
                <p><i class="fa-solid fa-location-dot"></i></p>
                <p><i class="fa-solid fa-phone"></i>951323583 / 935131721 / 949227229</p>
                <p><i class="fa-solid fa-envelope"></i></p>
                <p><i class="fa-solid fa-globe"></i>inasmec.com.pe</p>
            </div>
        </div>
        <div class="block">
            <div class="logo">
                <img src="multimedia/logo.png">
            </div>
            <div class="date">
                <div class="content">
                    <p>Fecha</p>
                    <p><?php echo $fila_cotizacion['fecha_reg']; ?></p>
                </div>
            </div>
        </div>
    </div>

    <div class="detalles">
        <p>Cliente</p>
        <p>: <?php echo $fila_cotizacion['cliente']; ?></p>
        <p></p>
        <p></p>
        <p>Moneda</p>
        <p>: <?php echo $fila_cotizacion['moneda']; ?></p>
        <p>RUC</p>
        <p>: <?php echo $fila_cotizacion['ruc']; ?></p>
        <p></p>
        <p></p>
        <p>F. Pago</p>
        <p>: <?php echo $fila_cotizacion['forma_pago']; ?></p>
        <p>Contacto</p>
        <p>: <?php echo $fila_cotizacion['telefono']; ?></p>
        <p></p>
        <p></p>
        <p>Validez</p>
        <p>: <?php echo $fila_cotizacion['validez']; ?></p>
        <p>L. Entrega</p>
        <p>: <?php echo $fila_cotizacion['lugar_entrega']; ?></p>
        <p></p>
        <p></p>
        <p>Atención</p>
        <p>: <?php echo $fila_cotizacion['atencion']; ?></p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Tiempo de Entrega</th>
                <th>Precio Unitario</th>
                <th>Total Producto</th>
            </tr>
        </thead>
        <tbody>
            <?php
            foreach ($detalles_cotizacion as $detalle) {
                echo "<tr>";
                echo "<td>" . $detalle['producto'] . "</td>";
                echo "<td>" . $detalle['cantidad'] . "</td>";
                echo "<td>" . $detalle['tiempo_entrega'] . "</td>";

                // Agrega la condición para mostrar el símbolo de la moneda
                echo "<td>" . ($fila_cotizacion['moneda'] == 'Soles' ? 'S/. ' : '$ ') . $detalle['precio_unitario'] . "</td>";

                echo "<td>" . ($fila_cotizacion['moneda'] == 'Soles' ? 'S/. ' : '$ ') . $detalle['total_producto'] . "</td>";
                echo "</tr>";
            }
            ?>
            <tr style="background: transparent;">
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bolder; padding: 0.4vh 0;">Subtotal</td>
                <td style="font-weight: bolder; padding: 0.4vh 0;"><?php echo ($fila_cotizacion['moneda'] == 'Soles' ? 'S/. ' : '$ ') . $fila_cotizacion['subtotal']; ?></td>
            </tr>
            <tr style="background: transparent;">
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bolder; padding: 0.4vh 0;">IGV 18%</td>
                <td style="font-weight: bolder; padding: 0.4vh 0;"><?php echo ($fila_cotizacion['moneda'] == 'Soles' ? 'S/. ' : '$ ') . $fila_cotizacion['igv']; ?></td>
            </tr>
            <tr style="background: transparent;">
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bolder; padding: 0.4vh 0;">Total Neto</td>
                <td style="font-weight: bolder; padding: 0.4vh 0;"><?php echo ($fila_cotizacion['moneda'] == 'Soles' ? 'S/. ' : '$ ') . $fila_cotizacion['total_neto']; ?></td>
            </tr>
        </tbody>
    </table>

    <div class="finalq">
        <p>Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros</p>
        <p>¡Gracias por hacer negocios con nosotros!</p>
    </div>

    <button class="btnimp" id="btnImprimir">Imprimir</button>

    <script>
        // Agrega un evento de clic al botón
        document.getElementById('btnImprimir').addEventListener('click', function() {
            // Llama a la función de impresión al hacer clic en el botón
            window.print();
        });
    </script>

    <?php
    // Cerrar la conexión
    mysqli_close($conex);
    ?>
</body>
</html>
