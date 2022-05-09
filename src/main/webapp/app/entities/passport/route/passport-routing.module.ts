import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PassportComponent } from '../list/passport.component';
import { PassportDetailComponent } from '../detail/passport-detail.component';
import { PassportUpdateComponent } from '../update/passport-update.component';
import { PassportRoutingResolveService } from './passport-routing-resolve.service';

const passportRoute: Routes = [
  {
    path: '',
    component: PassportComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PassportDetailComponent,
    resolve: {
      passport: PassportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PassportUpdateComponent,
    resolve: {
      passport: PassportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PassportUpdateComponent,
    resolve: {
      passport: PassportRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(passportRoute)],
  exports: [RouterModule],
})
export class PassportRoutingModule {}
