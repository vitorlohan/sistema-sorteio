import { DrawTemplate, IDrawTemplateDocument } from '../models/DrawTemplate';
import { DrawType, DrawConfig } from '../types';

const MAX_TEMPLATES_PER_USER = 50;

export class TemplateService {
  async create(
    userId: string,
    name: string,
    type: DrawType,
    config: DrawConfig
  ): Promise<IDrawTemplateDocument> {
    // Verificar limite de templates
    const count = await DrawTemplate.countDocuments({ userId });
    if (count >= MAX_TEMPLATES_PER_USER) {
      throw { status: 400, message: `Limite de ${MAX_TEMPLATES_PER_USER} modelos atingido` };
    }

    const template = await DrawTemplate.create({
      userId,
      name,
      type,
      config,
    });

    return template;
  }

  async getAll(userId: string): Promise<IDrawTemplateDocument[]> {
    return DrawTemplate.find({ userId })
      .sort({ updatedAt: -1 })
      .lean() as unknown as IDrawTemplateDocument[];
  }

  async getByType(userId: string, type: DrawType): Promise<IDrawTemplateDocument[]> {
    return DrawTemplate.find({ userId, type })
      .sort({ updatedAt: -1 })
      .lean() as unknown as IDrawTemplateDocument[];
  }

  async getById(userId: string, templateId: string): Promise<IDrawTemplateDocument | null> {
    return DrawTemplate.findOne({ _id: templateId, userId });
  }

  async update(
    userId: string,
    templateId: string,
    updates: { name?: string; config?: DrawConfig }
  ): Promise<IDrawTemplateDocument | null> {
    const template = await DrawTemplate.findOne({ _id: templateId, userId });
    if (!template) {
      throw { status: 404, message: 'Modelo não encontrado' };
    }

    if (updates.name) template.name = updates.name;
    if (updates.config) template.config = updates.config;

    await template.save();
    return template;
  }

  async delete(userId: string, templateId: string): Promise<boolean> {
    const result = await DrawTemplate.deleteOne({ _id: templateId, userId });
    if (result.deletedCount === 0) {
      throw { status: 404, message: 'Modelo não encontrado' };
    }
    return true;
  }
}

export const templateService = new TemplateService();
