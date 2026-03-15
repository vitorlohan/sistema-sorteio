import crypto from 'crypto';

/**
 * Gera um token aleatório seguro (usado para refresh tokens, reset de senha, etc.)
 */
export const generateSecureToken = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Cria um hash SHA-256 de um token (para armazenamento seguro)
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Compara um token com seu hash
 */
export const compareTokenHash = (token: string, hash: string): boolean => {
  const tokenHash = hashToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(tokenHash, 'hex'),
    Buffer.from(hash, 'hex')
  );
};
