import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBeer, Beer } from '../beer.model';
import { BeerService } from '../service/beer.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';
import { ManufacturerService } from 'app/entities/manufacturer/service/manufacturer.service';

@Component({
  selector: 'jhi-beer-update',
  templateUrl: './beer-update.component.html',
})
export class BeerUpdateComponent implements OnInit {
  isSaving = false;

  categoriesSharedCollection: ICategory[] = [];
  manufacturersSharedCollection: IManufacturer[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    price: [],
    category: [],
    manufacturer: [],
  });

  constructor(
    protected beerService: BeerService,
    protected categoryService: CategoryService,
    protected manufacturerService: ManufacturerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beer }) => {
      this.updateForm(beer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const beer = this.createFromForm();
    if (beer.id !== undefined) {
      this.subscribeToSaveResponse(this.beerService.update(beer));
    } else {
      this.subscribeToSaveResponse(this.beerService.create(beer));
    }
  }

  trackCategoryById(_index: number, item: ICategory): number {
    return item.id!;
  }

  trackManufacturerById(_index: number, item: IManufacturer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBeer>>): void {
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

  protected updateForm(beer: IBeer): void {
    this.editForm.patchValue({
      id: beer.id,
      name: beer.name,
      description: beer.description,
      price: beer.price,
      category: beer.category,
      manufacturer: beer.manufacturer,
    });

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(this.categoriesSharedCollection, beer.category);
    this.manufacturersSharedCollection = this.manufacturerService.addManufacturerToCollectionIfMissing(
      this.manufacturersSharedCollection,
      beer.manufacturer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.manufacturerService
      .query()
      .pipe(map((res: HttpResponse<IManufacturer[]>) => res.body ?? []))
      .pipe(
        map((manufacturers: IManufacturer[]) =>
          this.manufacturerService.addManufacturerToCollectionIfMissing(manufacturers, this.editForm.get('manufacturer')!.value)
        )
      )
      .subscribe((manufacturers: IManufacturer[]) => (this.manufacturersSharedCollection = manufacturers));
  }

  protected createFromForm(): IBeer {
    return {
      ...new Beer(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      price: this.editForm.get(['price'])!.value,
      category: this.editForm.get(['category'])!.value,
      manufacturer: this.editForm.get(['manufacturer'])!.value,
    };
  }
}
