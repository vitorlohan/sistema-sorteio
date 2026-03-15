import { User, IUserDocument } from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AuthTokens } from '../types';

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 409, message: 'Email já está em uso' };
    }

    const user = new User({ name, email, password });
    const tokens = generateTokens(user._id.toString());

    user.refreshTokens = [tokens.refreshToken];
    await user.save();

    return { user, tokens };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUserDocument; tokens: AuthTokens }> {
    const user = await User.findOne({ email }).select('+password +refreshTokens');
    if (!user) {
      throw { status: 401, message: 'Email ou senha incorretos' };
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Email ou senha incorretos' };
    }

    const tokens = generateTokens(user._id.toString());

    // Limitar tokens de refresh armazenados (máximo 5 sessões)
    user.refreshTokens = [...user.refreshTokens.slice(-4), tokens.refreshToken];
    await user.save();

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw { status: 401, message: 'Refresh token inválido ou expirado' };
    }

    const user = await User.findById(payload.userId).select('+refreshTokens');
    if (!user) {
      throw { status: 401, message: 'Usuário não encontrado' };
    }

    // Verificar se o refresh token está na lista de tokens do usuário
    const tokenIndex = user.refreshTokens.indexOf(refreshToken);
    if (tokenIndex === -1) {
      // Possível reutilização de token — invalidar todos
      user.refreshTokens = [];
      await user.save();
      throw { status: 401, message: 'Refresh token já utilizado. Todas as sessões foram encerradas.' };
    }

    // Rotacionar refresh token
    const tokens = generateTokens(user._id.toString());
    user.refreshTokens[tokenIndex] = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId).select('+refreshTokens');
    if (!user) return;

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }

  async logoutAll(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshTokens: [] });
  }

  async getProfile(userId: string): Promise<IUserDocument | null> {
    return User.findById(userId);
  }
}

export const authService = new AuthService();
