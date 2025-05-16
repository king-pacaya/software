    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productoAEliminar = null;

    function cargarCarrito() {
      const productos = JSON.parse(localStorage.getItem('productos')) || [];
      const carritoContainer = document.getElementById('carrito-container');
      carritoContainer.innerHTML = '';

      carrito.forEach((item, index) => {
        const producto = productos.find(p => p.nombre === item.nombre);
        const itemContainer = document.createElement('div');
        itemContainer.className = 'flex items-center border-b border-gray-300 pb-4';

        const imagen = document.createElement('img');
        imagen.src = item.imagen;
        imagen.alt = item.nombre;
        imagen.className = 'w-24 h-24 object-cover rounded mr-4';

        const infoContainer = document.createElement('div');
        infoContainer.className = 'flex-1';

        const nombre = document.createElement('h3');
        nombre.className = 'text-xl font-semibold';
        nombre.textContent = item.nombre;

        const precio = document.createElement('p');
        precio.className = 'text-lg text-gray-600';
        precio.textContent = `Precio: S/ ${item.precio.toFixed(2)}`;

        const stock = document.createElement('p');
        stock.className = 'text-sm text-gray-500';
        stock.textContent = `Stock disponible: ${producto.stock}`;

        const cantidadContainer = document.createElement('div');
        cantidadContainer.className = 'flex items-center space-x-2';

        const btnMinus = document.createElement('button');
        btnMinus.className = 'bg-gray-200 text-gray-700 font-bold p-1 rounded hover:bg-gray-300';
        btnMinus.innerHTML = '<i class="fas fa-minus"></i>';
        btnMinus.onclick = () => actualizarCantidad(index, -1, producto.stock);

        const cantidad = document.createElement('span');
        cantidad.className = 'text-lg font-semibold';
        cantidad.textContent = item.cantidad;

        const btnPlus = document.createElement('button');
        btnPlus.className = 'bg-gray-200 text-gray-700 font-bold p-1 rounded hover:bg-gray-300';
        btnPlus.innerHTML = '<i class="fas fa-plus"></i>';
        btnPlus.onclick = () => actualizarCantidad(index, 1, producto.stock);

        cantidadContainer.appendChild(btnMinus);
        cantidadContainer.appendChild(cantidad);
        cantidadContainer.appendChild(btnPlus);

        infoContainer.appendChild(nombre);
        infoContainer.appendChild(precio);
        infoContainer.appendChild(stock);
        infoContainer.appendChild(cantidadContainer);

        itemContainer.appendChild(imagen);
        itemContainer.appendChild(infoContainer);
        carritoContainer.appendChild(itemContainer);
      });

      actualizarTotal();
    }

    function actualizarCantidad(index, change, stockDisponible) {
      if (carrito[index].cantidad + change > stockDisponible) {
        mostrarModal('stockModal');
      } else {
        carrito[index].cantidad += change;
        if (carrito[index].cantidad === 0) {
          productoAEliminar = index;
          mostrarModal('eliminarModal');
        } else {
          guardarCarrito();
          cargarCarrito();
        }
      }
    }

    function actualizarTotal() {
      const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      document.getElementById('totalContainer').textContent = `Total: S/ ${total.toFixed(2)}`;
    }

    function guardarCarrito() {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    async function realizarPedido() {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (usuario) {
        const perfil = JSON.parse(localStorage.getItem('perfil'));
        const direccion = perfil ? `${perfil.direccion.provincia}, ${perfil.direccion.distrito}, ${perfil.direccion.calle}, ${perfil.direccion.codigoPostal}` : "Sin dirección";
        const costoTotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        const fechaHora = new Date().toLocaleString();
        const mensaje = `Gracias ${perfil.nombre || usuario.username}, su pedido será enviado a ${direccion}.`;
        document.getElementById('pedidoMensaje').textContent = mensaje;

        const recibos = JSON.parse(localStorage.getItem('recibos')) || [];
        const productos = JSON.parse(localStorage.getItem('productos')) || [];

        const nuevoRecibo = {
          id: Date.now(),
          nombre: perfil.nombre || usuario.username,
          apellido: perfil.apellido || "Sin apellido",
          direccion,
          telefono: perfil.telefono || "Sin teléfono",
          correo: perfil.correo || "Sin correo",
          costoTotal,
          fechaHora,
          items: carrito
        };
        recibos.push(nuevoRecibo);
        localStorage.setItem('recibos', JSON.stringify(recibos));

        carrito.forEach(item => {
          const producto = productos.find(p => p.nombre === item.nombre);
          if (producto) {
            producto.stock -= item.cantidad;
          }
        });

        localStorage.setItem('productos', JSON.stringify(productos));

        carrito = [];
        guardarCarrito();
        cargarCarrito();

        mostrarModal('pedidoModal');
      } else {
        mostrarModal('loginModal');
      }
    }

    function mostrarModal(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    }

    function cerrarModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    document.getElementById('confirmarEliminar').onclick = function () {
      carrito.splice(productoAEliminar, 1);
      guardarCarrito();
      cargarCarrito();
      cerrarModal('eliminarModal');
    };

    document.addEventListener('DOMContentLoaded', cargarCarrito);