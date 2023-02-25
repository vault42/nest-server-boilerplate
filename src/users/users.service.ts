import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password } = createUserDto
    const existUser = await this.prisma.user.findUnique({ where: { email } })
    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    createUserDto.password = hashedPassword
    if (!createUserDto.role) {
      createUserDto.role = 'USER'
    }
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
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist.`)
    }
    return user
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
