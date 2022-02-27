import * as bcrypt from 'bcrypt';
import {
  HttpException,
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PostgresErrorCode } from '../types';
import { JwtTokenPayload, MagicTokenPayload } from './strategies/types';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData) {
    const hashedPassword = registrationData.password
      ? await bcrypt.hash(registrationData.password, 10)
      : null;

    try {
      return await this.accountsService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists');
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getJwtToken(userId: number) {
    const payload: JwtTokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });

    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )}`,
    };
  }

  public getJwtRefreshToken(userId: number) {
    const payload: JwtTokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    });

    return {
      token,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_REFRESH_EXPIRATION_TIME',
      )}`,
    };
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.accountsService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  public sendMagicLink(email: string) {
    const payload: MagicTokenPayload = { email: email.toLowerCase() };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('MAGIC_LINK_SECRET'),
      expiresIn: `${this.configService.get('MAGIC_LINK_EXPIRATION_TIME')}s`,
    });

    return {
      callback: `/authentication/log-in/magic/callback?token=${token}`,
    };
  }
}
