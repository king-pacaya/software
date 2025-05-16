    function login() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      // Buscar el usuario en la base de datos de localStorage
      const usuario = usuarios.find(user => user.username === username);

      if (!usuario) {
        // Mostrar mensaje de error si el usuario no existe
        document.getElementById('login-error').classList.remove('hidden');
        document.getElementById('password-error').classList.add('hidden');
      } else if (usuario.password !== password) {
        // Mostrar mensaje de error si la contraseña es incorrecta
        document.getElementById('password-error').classList.remove('hidden');
        document.getElementById('login-error').classList.add('hidden');
      } else {
        // Iniciar sesión y redirigir al perfil
        localStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = 'perfil.html';
      }
    }

    function register() {
      const newUsername = document.getElementById('new-username').value;
      const newPassword = document.getElementById('new-password').value;
      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      // Verificar si el nombre de usuario ya existe
      const usuarioExistente = usuarios.find(user => user.username === newUsername);

      if (usuarioExistente) {
        alert('El nombre de usuario ya está registrado. Elija otro nombre de usuario.');
      } else {
        // Agregar nuevo usuario a la "base de datos"
        usuarios.push({ username: newUsername, password: newPassword });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Mostrar mensaje de éxito y cambiar a formulario de login
        document.getElementById('register-success').classList.remove('hidden');
        setTimeout(() => {
          toggleForms();
        }, 2000); // Espera 2 segundos y luego vuelve al formulario de login
      }
    }

    function toggleForms() {
      const loginForm = document.getElementById('login-form');
      const registerForm = document.getElementById('register-form');
      const formTitle = document.getElementById('form-title');
      const switchToRegister = document.getElementById('switch-to-register');
      const switchToLogin = document.getElementById('switch-to-login');

      // Alternar visibilidad entre los formularios de login y registro
      if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        formTitle.textContent = 'Iniciar sesión';
        switchToRegister.classList.remove('hidden');
        switchToLogin.classList.add('hidden');
      } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        formTitle.textContent = 'Registrar nuevo usuario';
        switchToRegister.classList.add('hidden');
        switchToLogin.classList.remove('hidden');
      }

      // Ocultar mensajes de error y éxito al cambiar de formulario
      document.getElementById('login-error').classList.add('hidden');
      document.getElementById('password-error').classList.add('hidden');
      document.getElementById('register-success').classList.add('hidden');
    }

    function submitOnEnter(event, formType) {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (formType === 'login') {
          login();
        } else if (formType === 'register') {
          register();
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem('usuario')) {
        window.location.href = 'perfil.html';
      }
    });