import mongoose, { Document, Schema } from 'mongoose';
import { DrawType, DrawConfig } from '../types';

export interface IDrawResultDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  type: DrawType;
  config: DrawConfig;
  results: (string | number)[];
  createdAt: Date;
}

const drawResultSchema = new Schema<IDrawResultDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(DrawType),
      required: [true, 'Tipo de sorteio é obrigatório'],
    },
    config: {
      type: Schema.Types.Mixed,
      required: [true, 'Configuração é obrigatória'],
    },
    results: {
      type: [Schema.Types.Mixed],
      required: [true, 'Resultados são obrigatórios'],
      validate: {
        validator: (v: unknown[]) => v.length > 0 && v.length <= 1000,
        message: 'Resultados devem ter entre 1 e 1000 itens',
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        const obj = { ...ret };
        delete (obj as Record<string, unknown>).__v;
        return obj;
      },
    },
  }
);

// TTL: resultados expiram em 30 dias
drawResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Index para buscar histórico do usuário
drawResultSchema.index({ userId: 1, createdAt: -1 });

export const DrawResult = mongoose.model<IDrawResultDocument>(
  'DrawResult',
  drawResultSchema
);
