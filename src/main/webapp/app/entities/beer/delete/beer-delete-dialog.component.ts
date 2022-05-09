import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBeer } from '../beer.model';
import { BeerService } from '../service/beer.service';

@Component({
  templateUrl: './beer-delete-dialog.component.html',
})
export class BeerDeleteDialogComponent {
  beer?: IBeer;

  constructor(protected beerService: BeerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.beerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
