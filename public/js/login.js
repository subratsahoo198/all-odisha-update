/**
 * ALL ODISHA UPDATE - Admin Login Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const token = localStorage.getItem('odisha_update_token');
  if (token) {
    window.location.href = '/admin.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleFormBtn = document.getElementById('toggle-form-btn');
  const portalSubtitle = document.getElementById('portal-subtitle');
  const errorAlert = document.getElementById('error-alert');

  let isRegisterMode = false;

  // Toggle Login/Register Forms
  toggleFormBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    errorAlert.classList.add('hidden');
    
    if (isRegisterMode) {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      portalSubtitle.textContent = 'Register Initial Administrator';
      toggleFormBtn.textContent = 'Already have an account? Login';
    } else {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      portalSubtitle.textContent = 'Admin Dashboard Secure Login';
      toggleFormBtn.textContent = 'First-time Setup? Create Admin Account';
    }
  });

  // Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorAlert.classList.add('hidden');

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const submitBtn = document.getElementById('login-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        // Save token and user details to localStorage
        localStorage.setItem('odisha_update_token', result.token);
        localStorage.setItem('odisha_update_user', JSON.stringify({
          name: result.name,
          email: result.email
        }));
        
        window.location.href = '/admin.html';
      } else {
        showError(result.message || 'Login failed. Invalid credentials.');
      }
    } catch (error) {
      showError('Network error. Unable to connect to server.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Handle Registration Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorAlert.classList.add('hidden');

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const adminSecret = document.getElementById('reg-secret').value.trim();

    if (!name || !email || !password || !adminSecret) {
      showError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }

    const submitBtn = document.getElementById('register-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Initializing Account...';

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, adminSecret })
      });

      const result = await response.json();

      if (result.success) {
        // Save details
        localStorage.setItem('odisha_update_token', result.token);
        localStorage.setItem('odisha_update_user', JSON.stringify({
          name: result.name,
          email: result.email
        }));
        
        window.location.href = '/admin.html';
      } else {
        showError(result.message || 'Registration failed. Verify Admin Setup Secret Key.');
      }
    } catch (error) {
      showError('Network error. Unable to connect to server.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  function showError(msg) {
    errorAlert.textContent = msg;
    errorAlert.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
