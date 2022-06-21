import jwt, {JwtPayload} from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  id?: string;
}

// Generate Access JWT
export const generateAccessToken = (id: string) => {
  return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '30s',
  });
};

// Generate Refresh JWT
export const generateRefreshToken = (id: string) => {
  return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '1d',
  });
};
