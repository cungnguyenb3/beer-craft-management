import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BeerComponent } from '../list/beer.component';
import { BeerDetailComponent } from '../detail/beer-detail.component';
import { BeerUpdateComponent } from '../update/beer-update.component';
import { BeerRoutingResolveService } from './beer-routing-resolve.service';

const beerRoute: Routes = [
  {
    path: '',
    component: BeerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BeerDetailComponent,
    resolve: {
      beer: BeerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BeerUpdateComponent,
    resolve: {
      beer: BeerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BeerUpdateComponent,
    resolve: {
      beer: BeerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(beerRoute)],
  exports: [RouterModule],
})
export class BeerRoutingModule {}
