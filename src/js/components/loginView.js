export const renderLogin = (onLoginSubmit) => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <section class="login-screen">
            <form id="login-form" class="login-card">
                <p class="eyebrow">Zone01 GraphQL</p>
                <h1>Sign in to your dashboard</h1>
                <p class="login-copy">Use your username or email.</p>
                <label class="login-field">
                    <span>Username or email</span>
                    <input id="login-identifier" type="text" placeholder="smiytek or emaildialk@email.com" required>
                </label>
                <label class="login-field">
                    <span>Password</span>
                    <input id="login-password" type="password" placeholder="Your password" required>
                </label>
                <button type="submit" class="primary-button">Login</button>
                <p id="error-msg" class="login-error" aria-live="polite"></p>
            </form>
        </section>
    `;

    const form = document.getElementById('login-form');
    const userInput = document.getElementById('login-identifier');
    const passInput = document.getElementById('login-password');
    
    //chwiya dial zkiir
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
            e.preventDefault();
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
    });

    form.onsubmit = (e) => {
        e.preventDefault();
        onLoginSubmit(userInput.value.trim(), passInput.value);
    };
};

export const showLoginError = (message) => {
    document.getElementById('error-msg').textContent = message;
};
