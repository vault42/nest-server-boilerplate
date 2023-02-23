import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto
    const existUser = await this.prisma.user.findUnique({ where: { email } })
    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    createUserDto.password = hashedPassword
    const user = await this.prisma.user.create({ data: createUserDto })
    return user
  }

  async findAll(page = 1, pageSize = 10) {
    const total = await this.prisma.user.count()
    const data = await this.prisma.user.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize
    })
    return {
      total,
      data
    }
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })
    return user
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })
    if (user) {
      return user
    }
    throw new HttpException('未找到该用户！', HttpStatus.NOT_FOUND)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto
    })
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } })
  }
}
