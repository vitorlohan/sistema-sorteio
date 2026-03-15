import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import http2 from 'http2';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import { apiLimiter } from './middlewares/rateLimiter';
import authRoutes from './routes/authRoutes';
import drawRoutes from './routes/drawRoutes';
import templateRoutes from './routes/templateRoutes';

const app = express();

// ===== Segurança =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24h
}));

// ===== Parsing =====
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ===== Rate Limiting global =====
app.use('/api', apiLimiter);

// ===== Rotas =====
app.use('/api/auth', authRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/templates', templateRoutes);

// ===== Health Check =====
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Sorteio API está funcionando',
    timestamp: new Date().toISOString(),
  });
});

// ===== 404 =====
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// ===== Error Handler Global =====
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

// ===== Inicialização =====
const PORT = parseInt(process.env.PORT || '3000', 10);

const startServer = async () => {
  await connectDatabase();

  const sslKeyPath = process.env.SSL_KEY_PATH;
  const sslCertPath = process.env.SSL_CERT_PATH;

  // Se certificados SSL existem, usar HTTP/2
  if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const options = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
      allowHTTP1: true,
    };

    const server = http2.createSecureServer(options, app as unknown as http2.Http2ServerRequest extends any ? any : never);

    server.listen(PORT, () => {
      console.log(`🚀 Servidor HTTP/2 rodando em https://localhost:${PORT}`);
      console.log(`📋 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } else {
    // Fallback para HTTP/1.1 em desenvolvimento
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Servidor HTTP/1.1 rodando em http://localhost:${PORT}`);
      console.log(`📋 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Para HTTP/2, configure SSL_KEY_PATH e SSL_CERT_PATH no .env');
      }
    });
  }
};

startServer().catch((error) => {
  console.error('❌ Falha ao iniciar o servidor:', error);
  process.exit(1);
});

export { app };
