import rateLimit from 'express-rate-limit';

// Rate limiter geral para API
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para autenticação (mais restritivo)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 tentativas de login por IP
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para sorteios (moderado)
export const drawLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 sorteios por minuto
  message: {
    success: false,
    message: 'Muitos sorteios realizados. Aguarde um momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
