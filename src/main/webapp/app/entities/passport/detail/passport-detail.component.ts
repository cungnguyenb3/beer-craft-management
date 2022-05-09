import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPassport } from '../passport.model';

@Component({
  selector: 'jhi-passport-detail',
  templateUrl: './passport-detail.component.html',
})
export class PassportDetailComponent implements OnInit {
  passport: IPassport | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ passport }) => {
      this.passport = passport;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
