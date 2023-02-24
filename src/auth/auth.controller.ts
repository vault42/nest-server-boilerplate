import { Body, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  async login(@Body() loginDto: LoginDto) {
    this.authService.login(loginDto)
  }
}
