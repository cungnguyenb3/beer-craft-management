import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPassport, getPassportIdentifier } from '../passport.model';

export type EntityResponseType = HttpResponse<IPassport>;
export type EntityArrayResponseType = HttpResponse<IPassport[]>;

@Injectable({ providedIn: 'root' })
export class PassportService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/passports');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(passport: IPassport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passport);
    return this.http
      .post<IPassport>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(passport: IPassport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passport);
    return this.http
      .put<IPassport>(`${this.resourceUrl}/${getPassportIdentifier(passport) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(passport: IPassport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(passport);
    return this.http
      .patch<IPassport>(`${this.resourceUrl}/${getPassportIdentifier(passport) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPassport>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPassport[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPassportToCollectionIfMissing(passportCollection: IPassport[], ...passportsToCheck: (IPassport | null | undefined)[]): IPassport[] {
    const passports: IPassport[] = passportsToCheck.filter(isPresent);
    if (passports.length > 0) {
      const passportCollectionIdentifiers = passportCollection.map(passportItem => getPassportIdentifier(passportItem)!);
      const passportsToAdd = passports.filter(passportItem => {
        const passportIdentifier = getPassportIdentifier(passportItem);
        if (passportIdentifier == null || passportCollectionIdentifiers.includes(passportIdentifier)) {
          return false;
        }
        passportCollectionIdentifiers.push(passportIdentifier);
        return true;
      });
      return [...passportsToAdd, ...passportCollection];
    }
    return passportCollection;
  }

  protected convertDateFromClient(passport: IPassport): IPassport {
    return Object.assign({}, passport, {
      addtionTime: passport.addtionTime?.isValid() ? passport.addtionTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.addtionTime = res.body.addtionTime ? dayjs(res.body.addtionTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((passport: IPassport) => {
        passport.addtionTime = passport.addtionTime ? dayjs(passport.addtionTime) : undefined;
      });
    }
    return res;
  }
}
