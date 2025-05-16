    function cargarPerfil() {
      const perfil = JSON.parse(localStorage.getItem('perfil')) || {};
      const userNameElement = document.getElementById('user-name');

      // Cargar datos de nombre y apellido
      document.getElementById('nombre').value = perfil.nombre || '';
      document.getElementById('apellido').value = perfil.apellido || '';

      // Actualizar el header con solo el nombre
      userNameElement.textContent = perfil.nombre || '';

      // Cargar datos de dirección
      document.getElementById('provincia').value = perfil.direccion?.provincia || '';
      document.getElementById('distrito').value = perfil.direccion?.distrito || '';
      document.getElementById('calle').value = perfil.direccion?.calle || '';
      document.getElementById('codigo-postal').value = perfil.direccion?.codigoPostal || '';

      // Cargar datos de teléfono y correo
      document.getElementById('telefono').value = perfil.telefono || '';
      document.getElementById('correo').value = perfil.correo || '';
    }

    function guardarPerfil() {
      const perfil = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        direccion: {
          provincia: document.getElementById('provincia').value,
          distrito: document.getElementById('distrito').value,
          calle: document.getElementById('calle').value,
          codigoPostal: document.getElementById('codigo-postal').value
        },
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
      };

      localStorage.setItem('perfil', JSON.stringify(perfil));
      mostrarModal('modalGuardar');
    }

    function mostrarModal(modalId) {
      document.getElementById(modalId).classList.remove('hidden');
    }

    function cerrarModal(modalId) {
      document.getElementById(modalId).classList.add('hidden');
    }

    function logout() {
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (!localStorage.getItem('usuario')) {
        window.location.href = 'login.html';
      } else {
        cargarPerfil();
      }
    });