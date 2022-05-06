import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBeer } from '../beer.model';

@Component({
  selector: 'jhi-beer-detail',
  templateUrl: './beer-detail.component.html',
})
export class BeerDetailComponent implements OnInit {
  beer: IBeer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beer }) => {
      this.beer = beer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
