export interface ICountry {
  id?: number;
  countryName?: string;
  countryCode?: string;
  phoneCode?: number | null;
}

export class Country implements ICountry {
  constructor(public id?: number, public countryName?: string, public countryCode?: string, public phoneCode?: number | null) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
