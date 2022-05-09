import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ManufacturerComponent } from './list/manufacturer.component';
import { ManufacturerDetailComponent } from './detail/manufacturer-detail.component';
import { ManufacturerUpdateComponent } from './update/manufacturer-update.component';
import { ManufacturerDeleteDialogComponent } from './delete/manufacturer-delete-dialog.component';
import { ManufacturerRoutingModule } from './route/manufacturer-routing.module';

@NgModule({
  imports: [SharedModule, ManufacturerRoutingModule],
  declarations: [ManufacturerComponent, ManufacturerDetailComponent, ManufacturerUpdateComponent, ManufacturerDeleteDialogComponent],
  entryComponents: [ManufacturerDeleteDialogComponent],
})
export class ManufacturerModule {}
