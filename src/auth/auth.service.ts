import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is wrong')
    }
    delete user.password
    return user
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
