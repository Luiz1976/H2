// routes/invitations.js
// Rotas de API para gerenciamento de convites

import express from 'express';
import { 
  validateConviteEmpresa, 
  validateConviteColaborador, 
  checkValidationErrors,
  inviteRateLimiter 
} from '../middleware/security.js';
import { 
  criarConviteEmpresa, 
  criarConviteColaborador, 
  buscarConvitePorToken, 
  listarConvites 
} from '../services/invitationService.js';

const router = express.Router();

// ========================================
// MIDDLEWARE DE AUTENTICAÇÃO SIMPLES
// ========================================

const verificarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      message: 'API key inválida ou ausente'
    });
  }
  
  next();
};

// ========================================
// ROTAS DE CONVITES DE EMPRESA
// ========================================

// POST /api/invitations/empresa - Criar convite de empresa
router.post('/empresa', 
  inviteRateLimiter,
  verificarApiKey,
  validateConviteEmpresa,
  checkValidationErrors,
  async (req, res) => {
    try {
      const { nome_empresa, email_contato, admin_id, dias_expiracao } = req.body;
      
      // Adicionar metadados da requisição
      const dadosConvite = {
        nome_empresa,
        email_contato,
        admin_id,
        dias_expiracao,
        ip_origem: req.ip,
        user_agent: req.get('User-Agent')
      };

      const resultado = await criarConviteEmpresa(dadosConvite);

      if (!resultado.success) {
        return res.status(400).json(resultado);
      }

      res.status(201).json(resultado);

    } catch (error) {
      console.error('❌ Erro na rota de convite empresa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// ========================================
// ROTAS DE CONVITES DE COLABORADOR
// ========================================

// POST /api/invitations/colaborador - Criar convite de colaborador
router.post('/colaborador',
  inviteRateLimiter,
  verificarApiKey,
  validateConviteColaborador,
  checkValidationErrors,
  async (req, res) => {
    try {
      const { nome, email, empresa_id, dias_expiracao } = req.body;
      
      // Adicionar metadados da requisição
      const dadosConvite = {
        nome,
        email,
        empresa_id,
        dias_expiracao,
        ip_origem: req.ip,
        user_agent: req.get('User-Agent')
      };

      const resultado = await criarConviteColaborador(dadosConvite);

      if (!resultado.success) {
        return res.status(400).json(resultado);
      }

      res.status(201).json(resultado);

    } catch (error) {
      console.error('❌ Erro na rota de convite colaborador:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// ========================================
// ROTAS DE CONSULTA
// ========================================

// GET /api/invitations/token/:token - Buscar convite por token
router.get('/token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { tipo = 'empresa' } = req.query;

    if (!token || token.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const resultado = await buscarConvitePorToken(token, tipo);

    if (!resultado.success) {
      return res.status(404).json(resultado);
    }

    res.json(resultado);

  } catch (error) {
    console.error('❌ Erro na busca por token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/invitations/list - Listar convites
router.get('/list',
  verificarApiKey,
  async (req, res) => {
    try {
      const { tipo, admin_id, empresa_id, status, limite } = req.query;

      const filtros = {
        tipo: tipo || 'empresa',
        admin_id,
        empresa_id,
        status,
        limite: parseInt(limite) || 50
      };

      const resultado = await listarConvites(filtros);

      if (!resultado.success) {
        return res.status(400).json(resultado);
      }

      res.json(resultado);

    } catch (error) {
      console.error('❌ Erro ao listar convites:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// ========================================
// ROTA DE HEALTH CHECK
// ========================================

// GET /api/invitations/health - Verificar saúde da API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de convites funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ========================================
// MIDDLEWARE DE ERRO PARA ROTAS NÃO ENCONTRADAS
// ========================================

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

export default router;