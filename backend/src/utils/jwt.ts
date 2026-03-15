import jwt from 'jsonwebtoken';
import { JwtPayload, AuthTokens } from '../types';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'ALTERE_PARA_UMA_CHAVE_SECRETA_FORTE_AQUI') {
    throw new Error('JWT_SECRET deve ser configurado com uma chave segura no .env');
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret || secret === 'ALTERE_PARA_OUTRA_CHAVE_SECRETA_FORTE_AQUI') {
    throw new Error('JWT_REFRESH_SECRET deve ser configurado com uma chave segura no .env');
  }
  return secret;
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as string & jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, getRefreshSecret(), {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string & jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  } as jwt.SignOptions);
};

export const generateTokens = (userId: string): AuthTokens => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret(), {
    algorithms: ['HS256'],
  }) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, getRefreshSecret(), {
    algorithms: ['HS256'],
  }) as JwtPayload;
};
