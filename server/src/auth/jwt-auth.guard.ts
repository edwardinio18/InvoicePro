import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@Injectable()
@ApiUnauthorizedResponse({
  description: 'Unauthorized. JWT token is invalid or missing.',
})
export class JwtAuthGuard extends AuthGuard('jwt') {}
