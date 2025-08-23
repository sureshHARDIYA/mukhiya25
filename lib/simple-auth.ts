// lib/simple-auth.ts - Simple admin authentication for testing
interface AdminCredentials {
  email: string;
  password: string;
}

// Simple hardcoded admin credentials for testing (you can change these)
const ADMIN_CREDENTIALS: AdminCredentials = {
  email: "admin@portfolio.com",
  password: "admin123", // Change this to a secure password
};

export const simpleAdminLogin = (email: string, password: string): boolean => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};

export const getAdminCredentials = () => ADMIN_CREDENTIALS;
