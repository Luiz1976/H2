// middleware/security.js
// Middleware de segurança para o servidor API

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por janela
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting mais restritivo para criação de convites
export const inviteRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 convites por 5 minutos
  message: {
    error: 'Limite de criação de convites excedido. Tente novamente em 5 minutos.',
    code: 'INVITE_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração do Helmet
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Validação para criação de convite de empresa
export const validateConviteEmpresa = [
  body('nome_empresa')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da empresa deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\-&.()]+$/)
    .withMessage('Nome da empresa contém caracteres inválidos'),
  
  body('email_contato')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido')
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),
  
  body('admin_id')
    .isUUID()
    .withMessage('ID do admin deve ser um UUID válido'),
  
  body('dias_expiracao')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Dias de expiração deve ser entre 1 e 30'),
];

// Validação para criação de convite de colaborador
export const validateConviteColaborador = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage('Nome contém caracteres inválidos'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido')
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),
  
  body('empresa_id')
    .isUUID()
    .withMessage('ID da empresa deve ser um UUID válido'),
  
  body('dias_expiracao')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Dias de expiração deve ser entre 1 e 30'),
];

// Middleware para verificar erros de validação
export const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Middleware para log de requests
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

// Middleware para tratamento de erros
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  
  // Não expor detalhes do erro em produção
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(isDevelopment && { stack: err.stack })
  });
};