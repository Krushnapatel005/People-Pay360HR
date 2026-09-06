import { Controller, Post, Body, Req, Res, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    const result = await this.authService.login(user);

    this.setCookies(res, result.accessToken, result.refreshToken);

    // Return the user with role info but NO tokens in the body (tokens are in HTTP-only cookies)
    return { user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user._id || user.id);
    this.clearCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user: any = req.user;
    const result = await this.authService.refreshTokens(user.sub, user.refreshToken);

    this.setCookies(res, result.accessToken, result.refreshToken);

    return { user: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    // Strip sensitive fields before returning to the client
    const { passwordHash, refreshTokenHash, ...safeUser } = user;
    return { user: safeUser };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: any) {
    // Scaffold only
    return { message: 'If an account with that email exists, we sent a password reset link.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: any) {
    // Scaffold only
    return { message: 'Password has been reset successfully.' };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const secure = this.configService.get('COOKIE_SECURE') === 'true' || isProduction;
    const sameSite = (this.configService.get('COOKIE_SAME_SITE') as 'lax' | 'strict' | 'none') || 'lax';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
