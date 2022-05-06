import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBeer, getBeerIdentifier } from '../beer.model';

export type EntityResponseType = HttpResponse<IBeer>;
export type EntityArrayResponseType = HttpResponse<IBeer[]>;

@Injectable({ providedIn: 'root' })
export class BeerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/beers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(beer: IBeer): Observable<EntityResponseType> {
    return this.http.post<IBeer>(this.resourceUrl, beer, { observe: 'response' });
  }

  update(beer: IBeer): Observable<EntityResponseType> {
    return this.http.put<IBeer>(`${this.resourceUrl}/${getBeerIdentifier(beer) as number}`, beer, { observe: 'response' });
  }

  partialUpdate(beer: IBeer): Observable<EntityResponseType> {
    return this.http.patch<IBeer>(`${this.resourceUrl}/${getBeerIdentifier(beer) as number}`, beer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBeer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBeer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBeerToCollectionIfMissing(beerCollection: IBeer[], ...beersToCheck: (IBeer | null | undefined)[]): IBeer[] {
    const beers: IBeer[] = beersToCheck.filter(isPresent);
    if (beers.length > 0) {
      const beerCollectionIdentifiers = beerCollection.map(beerItem => getBeerIdentifier(beerItem)!);
      const beersToAdd = beers.filter(beerItem => {
        const beerIdentifier = getBeerIdentifier(beerItem);
        if (beerIdentifier == null || beerCollectionIdentifiers.includes(beerIdentifier)) {
          return false;
        }
        beerCollectionIdentifiers.push(beerIdentifier);
        return true;
      });
      return [...beersToAdd, ...beerCollection];
    }
    return beerCollection;
  }
}
