import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PassportComponent } from './list/passport.component';
import { PassportDetailComponent } from './detail/passport-detail.component';
import { PassportUpdateComponent } from './update/passport-update.component';
import { PassportDeleteDialogComponent } from './delete/passport-delete-dialog.component';
import { PassportRoutingModule } from './route/passport-routing.module';

@NgModule({
  imports: [SharedModule, PassportRoutingModule],
  declarations: [PassportComponent, PassportDetailComponent, PassportUpdateComponent, PassportDeleteDialogComponent],
  entryComponents: [PassportDeleteDialogComponent],
})
export class PassportModule {}
