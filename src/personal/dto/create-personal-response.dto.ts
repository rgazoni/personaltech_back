import { $Enums, CrefOpts, Personal } from "@prisma/client";

export class CreatePersonalResponseDto implements Omit<Personal, 'password'> {
  readonly token: string;
  readonly id: string;
  readonly email: string;
  readonly cref: string;
  readonly is_cref_verified: CrefOpts;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly uid_chat: string;
  readonly city: string;
  readonly state: string;
  readonly role: $Enums.Role;
  readonly gender: string;
}
