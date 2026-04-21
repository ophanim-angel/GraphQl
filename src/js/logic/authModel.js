import { authURL } from '../configs/config.js';

const normalizeToken = (payload) => {
    if (typeof payload === 'string') {
        return payload;
    }

    if (typeof payload?.token === 'string') {
        return payload.token;
    }

    if (typeof payload?.jwt === 'string') {
        return payload.jwt;
    }

    throw new Error('Authentication succeeded but no JWT token was returned.');
};

export const loginUser = async (identifier, password) => {
    const credentials = btoa(`${identifier}:${password}`);

    const response = await fetch(authURL, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    const payload = await response.json();
    return normalizeToken(payload);
};
