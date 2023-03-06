export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidUsername = (username) => {
    return /^[a-z0-9]+$/.test(username);
};