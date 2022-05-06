export interface ICategory {
  id?: number;
  jobTitle?: string | null;
  description?: string | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public jobTitle?: string | null, public description?: string | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
