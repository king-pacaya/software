<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Estado de Conexión a la Base de Datos</title>
</head>
<body>
    <?php
    // Conexión a la base de datos
    $conex = mysqli_connect("161.132.57.223", "vazcmxri_root", "*A-mW5dJ-M", "vazcmxri_cotizacion_registro");

    // Verificar la conexión
    if (!$conex) {
        echo "<h1 style='color: red;'>Error de conexión a la base de datos</h1>";
    } else {
        echo "<h1 style='color: green;'>Conexión exitosa a la base de datos</h1>";
    }
    ?>

    <?php
    // Cerrar la conexión
    mysqli_close($conex);
    ?>
    Hola
</body>
</html>
