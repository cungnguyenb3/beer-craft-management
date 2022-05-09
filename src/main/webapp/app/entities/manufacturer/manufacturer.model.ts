import { ICountry } from 'app/entities/country/country.model';

export interface IManufacturer {
  id?: number;
  companyName?: string;
  country?: ICountry | null;
}

export class Manufacturer implements IManufacturer {
  constructor(public id?: number, public companyName?: string, public country?: ICountry | null) {}
}

export function getManufacturerIdentifier(manufacturer: IManufacturer): number | undefined {
  return manufacturer.id;
}
