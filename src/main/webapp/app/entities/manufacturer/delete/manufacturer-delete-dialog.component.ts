import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IManufacturer } from '../manufacturer.model';
import { ManufacturerService } from '../service/manufacturer.service';

@Component({
  templateUrl: './manufacturer-delete-dialog.component.html',
})
export class ManufacturerDeleteDialogComponent {
  manufacturer?: IManufacturer;

  constructor(protected manufacturerService: ManufacturerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.manufacturerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
