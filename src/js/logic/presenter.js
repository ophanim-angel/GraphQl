import { loginUser } from './authModel.js';
import { fetchDashboardData } from './dataModel.js';
import { renderLogin, showLoginError } from '../components/loginView.js';
import { renderProfile, renderProfileError } from '../components/profileView.js';

const TOKEN_KEY = 'jwt';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const initLogin = (onSuccess) => {
    renderLogin(async (username, password) => {
        try {
            const jwt = await loginUser(username, password);
            localStorage.setItem(TOKEN_KEY, jwt);
            onSuccess();
        } catch (err) {
            showLoginError(err.message || 'Credentials incorrect. Try again!');
        }
    });
};

export const initDashboard = async (onLogout) => {
    const token = getStoredToken();

    if (!token) {
        onLogout();
        return;
    }

    try {
        const profile = await fetchDashboardData(token);
        renderProfile(profile, () => {
            clearStoredToken();
            onLogout();
        });
    } catch (err) {
        clearStoredToken();
        renderProfileError(err.message || 'Something went wrong while loading your profile.', onLogout);
    }
};
