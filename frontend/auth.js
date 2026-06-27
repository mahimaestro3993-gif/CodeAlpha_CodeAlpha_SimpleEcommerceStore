const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    // Toggle between login and registration boxes
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    // Handle Login Submit
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                // Save JWT Token and user context securely in LocalStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email }));
                alert(`Welcome back, ${data.username}!`);
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Cannot connect to authorization server.');
        }
    });

    // Handle Registration Submit
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email }));
                alert('Account created successfully!');
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            alert('Cannot connect to authorization server.');
        }
    });
});