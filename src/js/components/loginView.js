export const renderLogin = (onLoginSubmit) => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <section class="login-screen">
            <form id="login-form" class="login-card">
                <p class="eyebrow">Zone01 GraphQL</p>
                <h1>Sign in to your dashboard</h1>
                <p class="login-copy">Use your username or email.</p>
                <label class="login-field">
                    <span>Identifier</span>
                    <input id="login-identifier" type="text" placeholder="Your Username or Email" required>
                </label>
                <label class="login-field">
                    <span>Password</span>
                    <input id="login-password" type="password" placeholder="Your Password" required>
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
        if (e.key === 'F12') {
            e.preventDefault();
        }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
            e.preventDefault();
        }
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
