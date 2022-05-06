export interface ICountry {
  id?: number;
  countryName?: string | null;
  countryCode?: string | null;
  phoneCode?: number | null;
}

export class Country implements ICountry {
  constructor(
    public id?: number,
    public countryName?: string | null,
    public countryCode?: string | null,
    public phoneCode?: number | null
  ) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
