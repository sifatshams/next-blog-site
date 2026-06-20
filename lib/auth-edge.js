import { SignJWT, jwtVerify } from 'jose';

// env validation
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing.');
}

const SECRET = new TextEncoder().encode(JWT_SECRET);

const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// generate token
export const generateToken = async (userId) => {
  return await new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRE)
    .sign(SECRET);
};

// verify token
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
