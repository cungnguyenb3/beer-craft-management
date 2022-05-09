import { ICategory } from 'app/entities/category/category.model';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';

export interface IBeer {
  id?: number;
  name?: string;
  description?: string;
  price?: number | null;
  imageContentType?: string | null;
  image?: string | null;
  category?: ICategory | null;
  manufacturer?: IManufacturer | null;
}

export class Beer implements IBeer {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public price?: number | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public category?: ICategory | null,
    public manufacturer?: IManufacturer | null
  ) {}
}

export function getBeerIdentifier(beer: IBeer): number | undefined {
  return beer.id;
}
