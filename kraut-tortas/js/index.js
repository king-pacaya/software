    let carrito = [];

    async function cargarProductos() {
      // Obtener los productos desde localStorage o productos.json
      let productos = JSON.parse(localStorage.getItem('productos'));

      if (!productos) {
        const response = await fetch('../productos.json');
        productos = await response.json();
        localStorage.setItem('productos', JSON.stringify(productos));
      }

      const contenedor = document.getElementById('productos-container');
      contenedor.innerHTML = '';

      productos.forEach(producto => {
        // Mostrar solo productos con stock disponible
        if (producto.stock > 0) {
          const productoCard = document.createElement('div');
          productoCard.className = 'bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105';

          const imagenContainer = document.createElement('div');
          imagenContainer.className = 'w-full h-56 overflow-hidden flex items-center justify-center';

          const imagen = document.createElement('img');
          imagen.src = producto.imagen;
          imagen.alt = producto.nombre;
          imagen.className = 'object-cover w-full h-full';

          imagenContainer.appendChild(imagen);

          const cardBody = document.createElement('div');
          cardBody.className = 'p-6 flex flex-col items-center';

          const nombre = document.createElement('h2');
          nombre.className = 'text-2xl font-semibold text-gray-800 mb-2';
          nombre.textContent = producto.nombre;

          const precio = document.createElement('p');
          precio.className = 'text-xl text-red-600 font-bold mb-2';
          precio.textContent = `S/ ${producto.precio.toFixed(2)}`;

          const stockInfo = document.createElement('p');
          stockInfo.className = 'text-sm text-gray-500 mb-2';
          stockInfo.textContent = `Stock: ${producto.stock}`;

          const boton = document.createElement('button');
          boton.className = 'bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700';
          boton.textContent = 'Agregar al carrito';
          boton.disabled = producto.stock <= 0;
          boton.onclick = () => agregarAlCarrito(producto);

          cardBody.appendChild(nombre);
          cardBody.appendChild(precio);
          cardBody.appendChild(stockInfo);
          cardBody.appendChild(boton);

          productoCard.appendChild(imagenContainer);
          productoCard.appendChild(cardBody);
          contenedor.appendChild(productoCard);
        }
      });
    }

    document.addEventListener('DOMContentLoaded', cargarProductos);

    function agregarAlCarrito(producto) {
      const productos = JSON.parse(localStorage.getItem('productos')) || [];
      const productoEnStock = productos.find(p => p.nombre === producto.nombre);

      // Validar que el stock permita agregar al carrito
      if (productoEnStock && productoEnStock.stock > 0) {
        const itemEnCarrito = carrito.find(item => item.nombre === producto.nombre);
        if (itemEnCarrito) {
          if (itemEnCarrito.cantidad < productoEnStock.stock) {
            itemEnCarrito.cantidad += 1;
          } else {
            alert(`No hay suficiente stock para agregar más de este producto.`);
          }
        } else {
          carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
      } else {
        alert(`Este producto está agotado.`);
      }
    }

    function actualizarContadorCarrito() {
      const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
      document.getElementById('carrito-count').textContent = totalItems;
    }

    document.addEventListener('DOMContentLoaded', () => {
      cargarProductos();
      carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      actualizarContadorCarrito();
    });

    // Mostrar/ocultar header al desplazar
    let lastScrollTop = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        header.classList.add('header-hidden');
        header.classList.remove('header-visible');
      } else {
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });