    function cargarRecibos() {
      const recibos = JSON.parse(localStorage.getItem('recibos')) || [];
      const contenedor = document.getElementById('recibos-container');
      contenedor.innerHTML = '';

      if (recibos.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-lg text-gray-600">No hay recibos disponibles.</p>';
        return;
      }

      // Ordenar los recibos de más nuevo a más viejo
      recibos.sort((a, b) => b.id - a.id);

      recibos.forEach(recibo => {
        const reciboDiv = document.createElement('div');
        reciboDiv.className = 'bg-white p-6 rounded-lg shadow-lg';

        const infoContainer = document.createElement('div');
        
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold mb-4 text-center';
        title.textContent = `Recibo #${recibo.id}`;

        const nombre = document.createElement('p');
        nombre.className = 'text-lg';
        nombre.textContent = `Nombre: ${recibo.nombre} ${recibo.apellido}`;

        const direccion = document.createElement('p');
        direccion.className = 'text-lg';
        direccion.textContent = `Dirección: ${recibo.direccion}`;

        const telefono = document.createElement('p');
        telefono.className = 'text-lg';
        telefono.textContent = `Teléfono: ${recibo.telefono}`;

        const correo = document.createElement('p');
        correo.className = 'text-lg';
        correo.textContent = `Correo: ${recibo.correo}`;

        const fechaHora = document.createElement('p');
        fechaHora.className = 'text-lg';
        fechaHora.textContent = `Fecha y Hora: ${recibo.fechaHora}`;

        infoContainer.appendChild(title);
        infoContainer.appendChild(nombre);
        infoContainer.appendChild(direccion);
        infoContainer.appendChild(telefono);
        infoContainer.appendChild(correo);
        infoContainer.appendChild(fechaHora);

        const itemsTable = document.createElement('table');
        itemsTable.className = 'w-full mt-4 border';
        itemsTable.innerHTML = `
          <thead>
            <tr class="bg-gray-200">
              <th class="border px-4 py-2 text-left">Producto</th>
              <th class="border px-4 py-2 text-left">Cantidad</th>
              <th class="border px-4 py-2 text-left">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${recibo.items.map(item => `
              <tr>
                <td class="border px-4 py-2">${item.nombre}</td>
                <td class="border px-4 py-2">${item.cantidad}</td>
                <td class="border px-4 py-2">S/ ${item.precio.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="font-bold">
              <td class="border px-4 py-2 text-right" colspan="2">Total</td>
              <td class="border px-4 py-2">S/ ${recibo.costoTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        `;
        infoContainer.appendChild(itemsTable);

        const downloadButton = document.createElement('button');
        downloadButton.className = 'bg-red-600 text-white px-6 py-2 mt-4 rounded-full font-semibold hover:bg-red-700 w-full flex items-center justify-center';
        downloadButton.innerHTML = '<i class="fas fa-download text-2xl mr-2"></i> Descargar Recibo';
        downloadButton.onclick = () => descargarRecibo(recibo);

        reciboDiv.appendChild(infoContainer);
        reciboDiv.appendChild(downloadButton);
        contenedor.appendChild(reciboDiv);
      });
    }

    function descargarRecibo(recibo) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Agregar logo y nombre de la tienda
      doc.addImage('multimedia/favicon-b.png', 'PNG', 10, 10, 15, 15);
      doc.setFontSize(16);
      doc.text("Kraut", 30, 18);
      doc.setFontSize(12);
      doc.text("Recibo de Pedido", 10, 35);

      // Información del comprador
      doc.setFontSize(10);
      doc.text(`ID: ${recibo.id}`, 10, 45);
      doc.text(`Nombre: ${recibo.nombre} ${recibo.apellido}`, 10, 55);
      doc.text(`Dirección: ${recibo.direccion}`, 10, 65);
      doc.text(`Teléfono: ${recibo.telefono}`, 10, 75);
      doc.text(`Correo: ${recibo.correo}`, 10, 85);
      doc.text(`Fecha y Hora: ${recibo.fechaHora}`, 10, 95);

      // Separador
      doc.text("------------", 10, 105);

      // Encabezado de la tabla de productos
      let startY = 115;
      doc.setFontSize(12);
      doc.text("Productos:", 10, startY);
      startY += 10;

      // Dibujar encabezado de la tabla
      doc.setFont("helvetica", "bold");
      doc.text("Producto", 10, startY);
      doc.text("Cantidad", 80, startY);
      doc.text("Precio", 140, startY);
      doc.setFont("helvetica", "normal");

      startY += 10;

      // Agregar productos a la tabla
      recibo.items.forEach(item => {
        doc.text(item.nombre, 10, startY);
        doc.text(item.cantidad.toString(), 80, startY);
        doc.text(`S/ ${item.precio.toFixed(2)}`, 140, startY);
        startY += 10;
      });

      // Separador
      startY += 10;
      doc.text("------------", 10, startY);
      startY += 10;

      // Total
      doc.setFont("helvetica", "bold");
      doc.text(`Total: S/ ${recibo.costoTotal.toFixed(2)}`, 140, startY);

      // Guardar el PDF
      doc.save(`recibo_${recibo.id}.pdf`);
    }

    document.addEventListener('DOMContentLoaded', cargarRecibos);