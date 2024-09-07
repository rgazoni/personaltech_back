import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async login(loginDto: LoginDto) {

    if (loginDto.type === 'personal') {
      const user = await this.prismaService.personal.findUnique({
        where: {
          email: loginDto.email,
          password: loginDto.password,
        },
      });

      if (!user)
        throw new Error('User not found');

      return user;
    } else { // trainee
      const user = await this.prismaService.trainee.findUnique({
        where: {
          email: loginDto.email,
          password: loginDto.password,
        },
      });

      if (!user)
        throw new Error('User not found');

      return user;
    }
  }

}
