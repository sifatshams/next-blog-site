import jwt from 'jsonwebtoken';

// jwt secret
const SECRET = process.env.JWT_SECRET;
// validation
if (!SECRET) {
  throw new Error('JWT_SECRET is missing.');
}
// jwt expire
const JWT_EXPIRE = process.env.JWT_EXPIRE;

// generate (jwt) token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: JWT_EXPIRE });
};

// verify (jwt) token
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
