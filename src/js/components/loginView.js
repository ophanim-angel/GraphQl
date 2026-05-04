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

    //  DevTools Detection Logic
    let devToolsDetected = false;
    const THRESHOLD = 160;

    const checkDevTools = () => {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        const isOpen = widthDiff > THRESHOLD || heightDiff > THRESHOLD;

        if (isOpen && !devToolsDetected) {
            devToolsDetected = true;
            document.body.innerHTML = '🔒 DevTools detected - Page cleared';
            document.body.style.backgroundColor = '#000';
            console.log("🔒 DevTools detected - Page cleared");
        }
    };

    // Listen for resize (docked DevTools)
    window.addEventListener('resize', checkDevTools);
    // Fallback polling for undocked/edge cases
    const devToolsInterval = setInterval(checkDevTools, 1000);

    // Cleanup: Stop checking if login succeeds (optional)
    const stopDevToolsCheck = () => {
        window.removeEventListener('resize', checkDevTools);
        clearInterval(devToolsInterval);
    };

    //  Anti-debug: Block context menu & keyboard shortcuts
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') e.preventDefault();
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) e.preventDefault();
        if (e.ctrlKey && e.key === 'u') e.preventDefault();
    }, { passive: false });

    // 📬 Handle login submission
    form.onsubmit = (e) => {
        e.preventDefault();
        stopDevToolsCheck(); // Stop DevTools checks after successful interaction
        onLoginSubmit(userInput.value.trim(), passInput.value);
    };
};

export const showLoginError = (message) => {
    const el = document.getElementById('error-msg');
    if (el) el.textContent = message;
};