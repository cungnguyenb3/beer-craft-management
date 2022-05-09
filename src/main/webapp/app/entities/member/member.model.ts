import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IMember {
  id?: number;
  address?: string;
  dateOfBirth?: dayjs.Dayjs | null;
  phone?: string | null;
  user?: IUser | null;
}

export class Member implements IMember {
  constructor(
    public id?: number,
    public address?: string,
    public dateOfBirth?: dayjs.Dayjs | null,
    public phone?: string | null,
    public user?: IUser | null
  ) {}
}

export function getMemberIdentifier(member: IMember): number | undefined {
  return member.id;
}
