import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // Decode JWT token
    return {
      email: decoded.userEmail, // Extract email
      role: decoded.role, // Extract role
    };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
