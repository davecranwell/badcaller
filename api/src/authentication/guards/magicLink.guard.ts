import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MagicLinkGuard extends AuthGuard('magic-link') {}
