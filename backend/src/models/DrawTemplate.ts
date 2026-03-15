import mongoose, { Document, Schema } from 'mongoose';
import { DrawType, DrawConfig } from '../types';

export interface IDrawTemplateDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: DrawType;
  config: DrawConfig;
  createdAt: Date;
  updatedAt: Date;
}

const drawTemplateSchema = new Schema<IDrawTemplateDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuário é obrigatório'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Nome do modelo é obrigatório'],
      trim: true,
      minlength: [1, 'Nome deve ter no mínimo 1 caractere'],
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    },
    type: {
      type: String,
      enum: Object.values(DrawType),
      required: [true, 'Tipo de sorteio é obrigatório'],
    },
    config: {
      type: Schema.Types.Mixed,
      required: [true, 'Configuração é obrigatória'],
      validate: {
        validator: function (this: IDrawTemplateDocument, config: DrawConfig) {
          return validateDrawConfig(this.type, config);
        },
        message: 'Configuração inválida para o tipo de sorteio',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const obj = { ...ret };
        delete (obj as Record<string, unknown>).__v;
        return obj;
      },
    },
  }
);

// Index composto para buscar templates de um usuário por tipo
drawTemplateSchema.index({ userId: 1, type: 1 });

// Limitar templates por usuário (máximo 50)
drawTemplateSchema.index({ userId: 1, createdAt: -1 });

function validateDrawConfig(type: DrawType, config: DrawConfig): boolean {
  switch (type) {
    case DrawType.NUMBER: {
      const c = config as { quantity?: number; min?: number; max?: number; allowRepeat?: boolean };
      return (
        typeof c.quantity === 'number' &&
        typeof c.min === 'number' &&
        typeof c.max === 'number' &&
        typeof c.allowRepeat === 'boolean' &&
        c.quantity > 0 &&
        c.quantity <= 1000 &&
        c.min < c.max &&
        c.min >= -1000000 &&
        c.max <= 1000000
      );
    }
    case DrawType.NAME: {
      const c = config as { quantity?: number; names?: string[]; allowRepeat?: boolean };
      return (
        typeof c.quantity === 'number' &&
        Array.isArray(c.names) &&
        typeof c.allowRepeat === 'boolean' &&
        c.quantity > 0 &&
        c.names.length > 0 &&
        c.names.length <= 1000 &&
        c.names.every((n: unknown) => typeof n === 'string' && n.length <= 200)
      );
    }
    case DrawType.ROULETTE: {
      const c = config as { entries?: string[]; colors?: string[] };
      return (
        Array.isArray(c.entries) &&
        Array.isArray(c.colors) &&
        c.entries.length >= 2 &&
        c.entries.length <= 100 &&
        c.colors.length >= 1 &&
        c.colors.length <= 20 &&
        c.entries.every((e: unknown) => typeof e === 'string' && e.length <= 200) &&
        c.colors.every((co: unknown) => typeof co === 'string' && /^#[0-9A-Fa-f]{6}$/.test(co as string))
      );
    }
    default:
      return false;
  }
}

export const DrawTemplate = mongoose.model<IDrawTemplateDocument>(
  'DrawTemplate',
  drawTemplateSchema
);
