import { ICategory } from 'app/entities/category/category.model';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';

export interface IBeer {
  id?: number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  category?: ICategory | null;
  manufacturer?: IManufacturer | null;
}

export class Beer implements IBeer {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public price?: number | null,
    public category?: ICategory | null,
    public manufacturer?: IManufacturer | null
  ) {}
}

export function getBeerIdentifier(beer: IBeer): number | undefined {
  return beer.id;
}
