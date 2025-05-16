    async function cargarInventario() {
      let productos = JSON.parse(localStorage.getItem('productos'));

      // Si no hay productos en localStorage, cargar desde productos.json y almacenarlos en localStorage
      if (!productos) {
        const response = await fetch('productos.json');
        productos = await response.json();
        localStorage.setItem('productos', JSON.stringify(productos));
      }

      const contenedor = document.getElementById('inventario-container');
      contenedor.innerHTML = '';

      // Mostrar productos en inventario
      productos.forEach((producto, index) => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'bg-white p-4 rounded-lg shadow-lg flex items-center justify-between';

        // Contenedor de imagen del producto
        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-24 h-24 flex-shrink-0 rounded overflow-hidden mr-4';
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = 'object-cover w-full h-full';
        imgContainer.appendChild(imagen);

        // Contenedor de información del producto
        const infoContainer = document.createElement('div');
        infoContainer.className = 'flex-1';
        infoContainer.innerHTML = `
          <h2 class="text-xl font-semibold">${producto.nombre}</h2>
          <p class="text-gray-600">Stock actual: ${producto.stock}</p>
        `;

        // Botón para añadir stock
        const botonStock = document.createElement('button');
        botonStock.className = 'bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700';
        botonStock.textContent = 'Añadir Stock';
        botonStock.onclick = () => mostrarCampoStock(botonStock, stockInputContainer);

        // Contenedor del campo para actualizar el stock, inicialmente oculto
        const stockInputContainer = document.createElement('div');
        stockInputContainer.className = 'hidden flex items-center mt-2';

        const stockInput = document.createElement('input');
        stockInput.type = 'number';
        stockInput.className = 'border px-2 py-1 rounded mr-2 w-20';
        stockInput.value = producto.stock;
        stockInput.min = producto.stock;

        // Guardar automáticamente al presionar Enter
        stockInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            actualizarStock(index, stockInput.value);
          }
        });

        const guardarStockButton = document.createElement('button');
        guardarStockButton.className = 'bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700';
        guardarStockButton.textContent = 'Guardar';
        guardarStockButton.onclick = () => actualizarStock(index, stockInput.value);

        stockInputContainer.appendChild(stockInput);
        stockInputContainer.appendChild(guardarStockButton);

        itemContainer.appendChild(imgContainer);
        itemContainer.appendChild(infoContainer);
        itemContainer.appendChild(botonStock);
        itemContainer.appendChild(stockInputContainer);
        contenedor.appendChild(itemContainer);
      });
    }

    function mostrarCampoStock(botonStock, stockInputContainer) {
      botonStock.classList.add('hidden'); // Ocultar el botón "Añadir Stock"
      stockInputContainer.classList.remove('hidden'); // Mostrar el contenedor de "Guardar"
    }

    function actualizarStock(index, nuevoStock) {
      let productos = JSON.parse(localStorage.getItem('productos')) || [];
      productos[index].stock = parseInt(nuevoStock);
      localStorage.setItem('productos', JSON.stringify(productos));
      cargarInventario();
    }

    document.addEventListener('DOMContentLoaded', cargarInventario);