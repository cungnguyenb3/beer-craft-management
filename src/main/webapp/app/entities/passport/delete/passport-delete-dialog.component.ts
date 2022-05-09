import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPassport } from '../passport.model';
import { PassportService } from '../service/passport.service';

@Component({
  templateUrl: './passport-delete-dialog.component.html',
})
export class PassportDeleteDialogComponent {
  passport?: IPassport;

  constructor(protected passportService: PassportService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.passportService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
