import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTraineeDto } from './dto/create-trainee.dto';
import { CometChatService } from 'src/common/comet-chat/comet-chat.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTraineeDto } from './dto/update-trainee.dto';
import { put } from "@vercel/blob";
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class TraineeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cometChatService: CometChatService,
  ) { }

  async create(createTraineeDto: CreateTraineeDto, file: Express.Multer.File) {

    if (!file)
      throw new Error('Avatar is required');

    const trainee_id = createId();

    // Create a Blob-like object from the file buffer
    const fileBlob = new Blob([file.buffer], { type: file.mimetype });

    // Upload the file to Vercel Blob Storage
    const { url } = await put(`trainees/${trainee_id}/avatar`, fileBlob, {
      access: 'public', // Optional: set access to public
    });

    const response = await this.cometChatService.createCometChatUser({
      name: createTraineeDto.full_name,
      avatar: url,
    });

    if (!response)
      throw new Error('CometChat user not created');

    const base64Avatar = file.buffer.toString('base64');

    const trainee = await this.prismaService.trainee.create({
      data: {
        id: trainee_id,
        ...createTraineeDto,
        avatar: base64Avatar,
        uid_chat: response.uuidKey,
        avatar_url: url
      }
    });

    if (!trainee)
      throw new Error('Trainee not created');

    return trainee;

  }

  async findQuery(query: string) {
    const trainees = await this.prismaService.trainee.findMany({
      where: {
        full_name: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });

    return trainees;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {

    const trainee = await this.prismaService.trainee.findUnique({
      where: {
        id: changePasswordDto.trainee_id
      }
    });

    if (!trainee)
      throw new Error('Trainee not found');

    if (trainee.password !== changePasswordDto.old_password)
      throw new Error('Old password is incorrect');

    const updatedTrainee = await this.prismaService.trainee.update({
      where: {
        id: changePasswordDto.trainee_id
      },
      data: {
        password: changePasswordDto.new_password
      }
    });

    if (!updatedTrainee)
      throw new Error('Password not updated');

    return updatedTrainee;
  }

  async findUnique(id: string) {
    const trainee = await this.prismaService.trainee.findUnique({
      where: {
        id
      }
    });

    if (!trainee)
      throw new Error('Trainee not found');

    return trainee;
  }

  async update(id: string, updateTraineeDto: UpdateTraineeDto) {
    const trainee = await this.prismaService.trainee.findUnique({
      where: {
        id
      }
    });

    if (!trainee)
      throw new Error('Trainee not found');

    const updatedTrainee = await this.prismaService.trainee.update({
      where: {
        id
      },
      data: {
        ...updateTraineeDto
      }
    });

    if (!updatedTrainee)
      throw new Error('Trainee not updated');

    return updatedTrainee;
  }
}
