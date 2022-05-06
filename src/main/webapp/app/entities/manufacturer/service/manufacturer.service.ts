import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IManufacturer, getManufacturerIdentifier } from '../manufacturer.model';

export type EntityResponseType = HttpResponse<IManufacturer>;
export type EntityArrayResponseType = HttpResponse<IManufacturer[]>;

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/manufacturers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(manufacturer: IManufacturer): Observable<EntityResponseType> {
    return this.http.post<IManufacturer>(this.resourceUrl, manufacturer, { observe: 'response' });
  }

  update(manufacturer: IManufacturer): Observable<EntityResponseType> {
    return this.http.put<IManufacturer>(`${this.resourceUrl}/${getManufacturerIdentifier(manufacturer) as number}`, manufacturer, {
      observe: 'response',
    });
  }

  partialUpdate(manufacturer: IManufacturer): Observable<EntityResponseType> {
    return this.http.patch<IManufacturer>(`${this.resourceUrl}/${getManufacturerIdentifier(manufacturer) as number}`, manufacturer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IManufacturer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IManufacturer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addManufacturerToCollectionIfMissing(
    manufacturerCollection: IManufacturer[],
    ...manufacturersToCheck: (IManufacturer | null | undefined)[]
  ): IManufacturer[] {
    const manufacturers: IManufacturer[] = manufacturersToCheck.filter(isPresent);
    if (manufacturers.length > 0) {
      const manufacturerCollectionIdentifiers = manufacturerCollection.map(
        manufacturerItem => getManufacturerIdentifier(manufacturerItem)!
      );
      const manufacturersToAdd = manufacturers.filter(manufacturerItem => {
        const manufacturerIdentifier = getManufacturerIdentifier(manufacturerItem);
        if (manufacturerIdentifier == null || manufacturerCollectionIdentifiers.includes(manufacturerIdentifier)) {
          return false;
        }
        manufacturerCollectionIdentifiers.push(manufacturerIdentifier);
        return true;
      });
      return [...manufacturersToAdd, ...manufacturerCollection];
    }
    return manufacturerCollection;
  }
}
