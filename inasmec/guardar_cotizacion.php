<?php
// Conexión a la base de datos
$conex = mysqli_connect("161.132.57.223", "vazcmxri_root", "*A-mW5dJ-M", "vazcmxri_cotizacion_registro");

// Verificar la conexión
//if (!$conex) {
//    echo "<h1 style='color: red;'>Error de conexión a la base de datos</h1>";
//} else {
//    echo "<h1 style='color: green;'>Conexión exitosa a la base de datos</h1>";
//}

// Obtener valores del formulario
$cliente = $_POST['cliente'];
$telefono = $_POST['telefono'];
$forma_pago = $_POST['forma_pago'];
$moneda = $_POST['moneda'];
$ruc = $_POST['ruc'];
$lugar_entrega = $_POST['lugar_entrega'];
$atencion = $_POST['atencion'];
$validez = $_POST['validez'];

// Calcular el año actual
$anio = date("Y");
$fecha_reg = date("Y-m-d");

// Calcular subtotal, igv y total_neto
$productos = $_POST['producto'];
$cantidades = $_POST['cantidad'];
$precios_unitarios = $_POST['precio_unitario'];

$subtotal = 0;
foreach ($productos as $key => $producto) {
    $cantidad = $cantidades[$key];
    $precio_unitario = $precios_unitarios[$key];
    $total_producto = $cantidad * $precio_unitario;
    $subtotal += $total_producto;
}

$igv = $subtotal * 0.18;
$total_neto = $subtotal + $igv;

// Insertar en la tabla de cotizaciones
$insert_cotizacion = "INSERT INTO cotizaciones (anio, cliente, telefono, forma_pago, moneda, ruc, lugar_entrega, atencion, validez, subtotal, igv, total_neto, fecha_reg) VALUES ('$anio', '$cliente', '$telefono', '$forma_pago', '$moneda', '$ruc', '$lugar_entrega', '$atencion', '$validez', '$subtotal', '$igv', '$total_neto','$fecha_reg')";

if (mysqli_query($conex, $insert_cotizacion)) {
    $cotizacion_id = mysqli_insert_id($conex); // Obtener el ID de la cotización insertada
    // Insertar detalles de cotización
    $productos = $_POST['producto'];
    $cantidades = $_POST['cantidad'];
    $precios_unitarios = $_POST['precio_unitario'];
    $tiempos_entrega = $_POST['tiempo_entrega'];

    foreach ($productos as $key => $producto) {
        $cantidad = $cantidades[$key];
        $precio_unitario = $precios_unitarios[$key];
        $total_producto = $cantidad * $precio_unitario;
        $tiempo_entrega = $tiempos_entrega[$key];

        $insert_detalle = "INSERT INTO detalles_cotizacion (cotizacion_id, producto, cantidad, precio_unitario, total_producto, tiempo_entrega) VALUES ('$cotizacion_id', '$producto', '$cantidad', '$precio_unitario', '$total_producto', '$tiempo_entrega')";
        mysqli_query($conex, $insert_detalle);
    }

    // Redirigir a la página de visualización
    header("Location: ver_cotizacion.php?id=$cotizacion_id");
} else {
    echo "Error al guardar la cotización: " . mysqli_error($conex);
}

// Cerrar la conexión
mysqli_close($conex);
?>
