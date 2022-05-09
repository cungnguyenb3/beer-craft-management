import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPassport, Passport } from '../passport.model';
import { PassportService } from '../service/passport.service';

@Injectable({ providedIn: 'root' })
export class PassportRoutingResolveService implements Resolve<IPassport> {
  constructor(protected service: PassportService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPassport> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((passport: HttpResponse<Passport>) => {
          if (passport.body) {
            return of(passport.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Passport());
  }
}
