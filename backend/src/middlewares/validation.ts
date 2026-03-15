import { body, param, ValidationChain } from 'express-validator';
import { DrawType } from '../types';

// Validações de autenticação
export const registerValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

export const refreshTokenValidation: ValidationChain[] = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token é obrigatório')
    .isString()
    .withMessage('Refresh token deve ser uma string'),
];

// Validações de sorteio de números
export const numberDrawValidation: ValidationChain[] = [
  body('quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantidade deve ser entre 1 e 1000'),
  body('min')
    .isInt({ min: -1000000, max: 1000000 })
    .withMessage('Valor mínimo deve ser entre -1.000.000 e 1.000.000'),
  body('max')
    .isInt({ min: -1000000, max: 1000000 })
    .withMessage('Valor máximo deve ser entre -1.000.000 e 1.000.000'),
  body('allowRepeat')
    .isBoolean()
    .withMessage('allowRepeat deve ser verdadeiro ou falso'),
  body('max').custom((max, { req }) => {
    if (parseInt(max) <= parseInt(req.body.min)) {
      throw new Error('Valor máximo deve ser maior que o mínimo');
    }
    return true;
  }),
  body('quantity').custom((quantity, { req }) => {
    if (!req.body.allowRepeat || req.body.allowRepeat === 'false') {
      const range = parseInt(req.body.max) - parseInt(req.body.min) + 1;
      if (parseInt(quantity) > range) {
        throw new Error('Quantidade não pode ser maior que o intervalo disponível quando não permite repetição');
      }
    }
    return true;
  }),
];

// Validações de sorteio de nomes
export const nameDrawValidation: ValidationChain[] = [
  body('quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantidade deve ser entre 1 e 1000'),
  body('names')
    .isArray({ min: 1, max: 1000 })
    .withMessage('Lista de nomes deve ter entre 1 e 1000 itens'),
  body('names.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Cada nome deve ter entre 1 e 200 caracteres')
    .escape(),
  body('allowRepeat')
    .isBoolean()
    .withMessage('allowRepeat deve ser verdadeiro ou falso'),
  body('quantity').custom((quantity, { req }) => {
    if ((!req.body.allowRepeat || req.body.allowRepeat === 'false') && req.body.names) {
      if (parseInt(quantity) > req.body.names.length) {
        throw new Error('Quantidade não pode ser maior que o número de nomes quando não permite repetição');
      }
    }
    return true;
  }),
];

// Validações de sorteio de roleta
export const rouletteDrawValidation: ValidationChain[] = [
  body('entries')
    .isArray({ min: 2, max: 100 })
    .withMessage('Entradas deve ter entre 2 e 100 itens'),
  body('entries.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Cada entrada deve ter entre 1 e 200 caracteres')
    .escape(),
  body('colors')
    .isArray({ min: 1, max: 20 })
    .withMessage('Cores deve ter entre 1 e 20 itens'),
  body('colors.*')
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Cada cor deve ser um código hexadecimal válido (ex: #FF0000)'),
];

// Validações de template
export const templateValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome do modelo deve ter entre 1 e 100 caracteres')
    .escape(),
  body('type')
    .isIn(Object.values(DrawType))
    .withMessage('Tipo de sorteio inválido'),
  body('config')
    .isObject()
    .withMessage('Configuração deve ser um objeto'),
];

// Validações de ID
export const idValidation: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
];
