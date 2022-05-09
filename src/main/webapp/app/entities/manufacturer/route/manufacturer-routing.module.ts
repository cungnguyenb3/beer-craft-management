import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ManufacturerComponent } from '../list/manufacturer.component';
import { ManufacturerDetailComponent } from '../detail/manufacturer-detail.component';
import { ManufacturerUpdateComponent } from '../update/manufacturer-update.component';
import { ManufacturerRoutingResolveService } from './manufacturer-routing-resolve.service';

const manufacturerRoute: Routes = [
  {
    path: '',
    component: ManufacturerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ManufacturerDetailComponent,
    resolve: {
      manufacturer: ManufacturerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ManufacturerUpdateComponent,
    resolve: {
      manufacturer: ManufacturerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ManufacturerUpdateComponent,
    resolve: {
      manufacturer: ManufacturerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(manufacturerRoute)],
  exports: [RouterModule],
})
export class ManufacturerRoutingModule {}
