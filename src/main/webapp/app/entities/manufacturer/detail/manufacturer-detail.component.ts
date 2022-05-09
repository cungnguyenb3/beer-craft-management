import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IManufacturer } from '../manufacturer.model';

@Component({
  selector: 'jhi-manufacturer-detail',
  templateUrl: './manufacturer-detail.component.html',
})
export class ManufacturerDetailComponent implements OnInit {
  manufacturer: IManufacturer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ manufacturer }) => {
      this.manufacturer = manufacturer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
