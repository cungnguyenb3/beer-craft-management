import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBeer, Beer } from '../beer.model';
import { BeerService } from '../service/beer.service';

@Injectable({ providedIn: 'root' })
export class BeerRoutingResolveService implements Resolve<IBeer> {
  constructor(protected service: BeerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBeer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((beer: HttpResponse<Beer>) => {
          if (beer.body) {
            return of(beer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Beer());
  }
}
