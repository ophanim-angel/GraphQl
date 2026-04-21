import { initDashboard, initLogin, clearStoredToken, getStoredToken } from './logic/presenter.js';

const renderRoute = async () => {
    const token = getStoredToken();
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const onLoginPage = path === '/login' || path.startsWith('/login/');

    if (token && onLoginPage) {
        window.location.replace('/');
        return;
    }

    if (!token) {
        if (!onLoginPage) {
            window.history.replaceState({}, '', '/login');
        }
        initLogin(() => {
            renderRoute();
        });
        return;
    }

    window.history.replaceState({}, '', '/');
    await initDashboard(() => {
        clearStoredToken();
        renderRoute();
    });
};

window.addEventListener('popstate', renderRoute);

renderRoute();
