import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaKnownError(error: Prisma.PrismaClientKnownRequestError): void {
  switch (error.code) {
    case 'P2002': // Prisma unique constraint violation code
      throw new ConflictException({
        message: 'You are trying to create a resource that already exists.',
        meta: error.meta,
      });
    default:
      throw error;
  }
}
