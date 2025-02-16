import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userEmail: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const generateRandomCode = (length = 6) => {
  const min = Math.pow(10, length - 1); // Minimum value (e.g., 100000 for 6 digits)
  const max = Math.pow(10, length) - 1; // Maximum value (e.g., 999999 for 6 digits)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
