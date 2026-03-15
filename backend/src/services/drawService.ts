import crypto from 'crypto';
import { DrawResult } from '../models/DrawResult';
import { DrawType, INumberDrawConfig, INameDrawConfig, IRouletteDrawConfig } from '../types';

export class DrawService {
  /**
   * Sorteio de números usando crypto para aleatoriedade segura
   */
  async drawNumbers(config: INumberDrawConfig, userId?: string): Promise<number[]> {
    const { quantity, min, max, allowRepeat } = config;
    const results: number[] = [];
    const range = max - min + 1;

    if (!allowRepeat && quantity > range) {
      throw { status: 400, message: 'Quantidade maior que o intervalo disponível' };
    }

    if (allowRepeat) {
      for (let i = 0; i < quantity; i++) {
        results.push(this.secureRandomInt(min, max));
      }
    } else {
      // Fisher-Yates shuffle para seleção sem repetição
      const pool = Array.from({ length: range }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = this.secureRandomInt(0, i);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      results.push(...pool.slice(0, quantity));
    }

    // Salvar resultado
    await DrawResult.create({
      userId: userId || null,
      type: DrawType.NUMBER,
      config,
      results,
    });

    return results;
  }

  /**
   * Sorteio de nomes
   */
  async drawNames(config: INameDrawConfig, userId?: string): Promise<string[]> {
    const { quantity, names, allowRepeat } = config;
    const results: string[] = [];

    if (!allowRepeat && quantity > names.length) {
      throw { status: 400, message: 'Quantidade maior que o número de nomes disponíveis' };
    }

    if (allowRepeat) {
      for (let i = 0; i < quantity; i++) {
        const index = this.secureRandomInt(0, names.length - 1);
        results.push(names[index]);
      }
    } else {
      // Fisher-Yates shuffle
      const pool = [...names];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = this.secureRandomInt(0, i);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      results.push(...pool.slice(0, quantity));
    }

    // Salvar resultado
    await DrawResult.create({
      userId: userId || null,
      type: DrawType.NAME,
      config,
      results,
    });

    return results;
  }

  /**
   * Sorteio de roleta - retorna o item sorteado e o ângulo de rotação
   */
  async drawRoulette(
    config: IRouletteDrawConfig,
    userId?: string
  ): Promise<{ winner: string; winnerIndex: number; angle: number }> {
    const { entries } = config;
    const winnerIndex = this.secureRandomInt(0, entries.length - 1);
    const winner = entries[winnerIndex];

    // Calcular ângulo para animação da roleta
    const sliceAngle = 360 / entries.length;
    const baseAngle = 360 * 5; // 5 voltas completas
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);
    const angle = baseAngle + targetAngle + this.secureRandomInt(-5, 5); // Variação pequena

    // Salvar resultado
    await DrawResult.create({
      userId: userId || null,
      type: DrawType.ROULETTE,
      config,
      results: [winner],
    });

    return { winner, winnerIndex, angle };
  }

  /**
   * Buscar histórico de sorteios do usuário
   */
  async getHistory(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const safeLimit = Math.min(limit, 50);

    const [results, total] = await Promise.all([
      DrawResult.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      DrawResult.countDocuments({ userId }),
    ]);

    return {
      results,
      pagination: {
        page,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Gera um número inteiro aleatório criptograficamente seguro no intervalo [min, max]
   */
  private secureRandomInt(min: number, max: number): number {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
    const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;

    let randomValue: number;
    do {
      const randomBytes = crypto.randomBytes(bytesNeeded);
      randomValue = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomValue = randomValue * 256 + randomBytes[i];
      }
    } while (randomValue > maxValid);

    return min + (randomValue % range);
  }
}

export const drawService = new DrawService();
