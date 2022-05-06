import dayjs from 'dayjs/esm';
import { IMember } from 'app/entities/member/member.model';
import { IBeer } from 'app/entities/beer/beer.model';

export interface IPassport {
  id?: number;
  addtionTime?: dayjs.Dayjs | null;
  member?: IMember | null;
  beer?: IBeer | null;
}

export class Passport implements IPassport {
  constructor(public id?: number, public addtionTime?: dayjs.Dayjs | null, public member?: IMember | null, public beer?: IBeer | null) {}
}

export function getPassportIdentifier(passport: IPassport): number | undefined {
  return passport.id;
}
