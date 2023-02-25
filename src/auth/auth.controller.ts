import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UserEntity } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import JwtAuthGuard from './guards/jwt-auth.guard'
import LocalAuthGuard from './guards/local-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserEntity })
  async register(@Body() registerDto: CreateUserDto) {
    return await this.usersService.create(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user
  }
}
