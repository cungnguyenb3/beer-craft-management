import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPassport, Passport } from '../passport.model';
import { PassportService } from '../service/passport.service';
import { IMember } from 'app/entities/member/member.model';
import { MemberService } from 'app/entities/member/service/member.service';
import { IBeer } from 'app/entities/beer/beer.model';
import { BeerService } from 'app/entities/beer/service/beer.service';

@Component({
  selector: 'jhi-passport-update',
  templateUrl: './passport-update.component.html',
})
export class PassportUpdateComponent implements OnInit {
  isSaving = false;

  membersCollection: IMember[] = [];
  beersSharedCollection: IBeer[] = [];

  editForm = this.fb.group({
    id: [],
    additionTime: [],
    member: [],
    beer: [],
  });

  constructor(
    protected passportService: PassportService,
    protected memberService: MemberService,
    protected beerService: BeerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ passport }) => {
      if (passport.id === undefined) {
        const today = dayjs().startOf('day');
        passport.additionTime = today;
      }

      this.updateForm(passport);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const passport = this.createFromForm();
    if (passport.id !== undefined) {
      this.subscribeToSaveResponse(this.passportService.update(passport));
    } else {
      this.subscribeToSaveResponse(this.passportService.create(passport));
    }
  }

  trackMemberById(_index: number, item: IMember): number {
    return item.id!;
  }

  trackBeerById(_index: number, item: IBeer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPassport>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(passport: IPassport): void {
    this.editForm.patchValue({
      id: passport.id,
      additionTime: passport.additionTime ? passport.additionTime.format(DATE_TIME_FORMAT) : null,
      member: passport.member,
      beer: passport.beer,
    });

    this.membersCollection = this.memberService.addMemberToCollectionIfMissing(this.membersCollection, passport.member);
    this.beersSharedCollection = this.beerService.addBeerToCollectionIfMissing(this.beersSharedCollection, passport.beer);
  }

  protected loadRelationshipsOptions(): void {
    this.memberService
      .query({ filter: 'passport-is-null' })
      .pipe(map((res: HttpResponse<IMember[]>) => res.body ?? []))
      .pipe(map((members: IMember[]) => this.memberService.addMemberToCollectionIfMissing(members, this.editForm.get('member')!.value)))
      .subscribe((members: IMember[]) => (this.membersCollection = members));

    this.beerService
      .query()
      .pipe(map((res: HttpResponse<IBeer[]>) => res.body ?? []))
      .pipe(map((beers: IBeer[]) => this.beerService.addBeerToCollectionIfMissing(beers, this.editForm.get('beer')!.value)))
      .subscribe((beers: IBeer[]) => (this.beersSharedCollection = beers));
  }

  protected createFromForm(): IPassport {
    return {
      ...new Passport(),
      id: this.editForm.get(['id'])!.value,
      additionTime: this.editForm.get(['additionTime'])!.value
        ? dayjs(this.editForm.get(['additionTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      member: this.editForm.get(['member'])!.value,
      beer: this.editForm.get(['beer'])!.value,
    };
  }
}
