import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IManufacturer, Manufacturer } from '../manufacturer.model';
import { ManufacturerService } from '../service/manufacturer.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

@Component({
  selector: 'jhi-manufacturer-update',
  templateUrl: './manufacturer-update.component.html',
})
export class ManufacturerUpdateComponent implements OnInit {
  isSaving = false;

  countriesSharedCollection: ICountry[] = [];

  editForm = this.fb.group({
    id: [],
    companyName: [],
    country: [],
  });

  constructor(
    protected manufacturerService: ManufacturerService,
    protected countryService: CountryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ manufacturer }) => {
      this.updateForm(manufacturer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const manufacturer = this.createFromForm();
    if (manufacturer.id !== undefined) {
      this.subscribeToSaveResponse(this.manufacturerService.update(manufacturer));
    } else {
      this.subscribeToSaveResponse(this.manufacturerService.create(manufacturer));
    }
  }

  trackCountryById(_index: number, item: ICountry): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IManufacturer>>): void {
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

  protected updateForm(manufacturer: IManufacturer): void {
    this.editForm.patchValue({
      id: manufacturer.id,
      companyName: manufacturer.companyName,
      country: manufacturer.country,
    });

    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing(
      this.countriesSharedCollection,
      manufacturer.country
    );
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing(countries, this.editForm.get('country')!.value))
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));
  }

  protected createFromForm(): IManufacturer {
    return {
      ...new Manufacturer(),
      id: this.editForm.get(['id'])!.value,
      companyName: this.editForm.get(['companyName'])!.value,
      country: this.editForm.get(['country'])!.value,
    };
  }
}
