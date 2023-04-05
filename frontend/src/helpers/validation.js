// Regular expressions to test valid usernames and emails are submitted by users in the frontend.

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidUsername = (username) => {
  return /^[a-z0-9]+$/.test(username);
};
