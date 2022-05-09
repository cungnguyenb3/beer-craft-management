import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BeerComponent } from './list/beer.component';
import { BeerDetailComponent } from './detail/beer-detail.component';
import { BeerUpdateComponent } from './update/beer-update.component';
import { BeerDeleteDialogComponent } from './delete/beer-delete-dialog.component';
import { BeerRoutingModule } from './route/beer-routing.module';

@NgModule({
  imports: [SharedModule, BeerRoutingModule],
  declarations: [BeerComponent, BeerDetailComponent, BeerUpdateComponent, BeerDeleteDialogComponent],
  entryComponents: [BeerDeleteDialogComponent],
})
export class BeerModule {}
