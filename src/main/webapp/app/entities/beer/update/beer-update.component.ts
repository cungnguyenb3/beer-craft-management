import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBeer, Beer } from '../beer.model';
import { BeerService } from '../service/beer.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
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
    name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    description: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4500)]],
    price: [],
    image: [],
    imageContentType: [],
    category: [],
    manufacturer: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected beerService: BeerService,
    protected categoryService: CategoryService,
    protected manufacturerService: ManufacturerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beer }) => {
      this.updateForm(beer);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('craftApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
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
      image: beer.image,
      imageContentType: beer.imageContentType,
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
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      category: this.editForm.get(['category'])!.value,
      manufacturer: this.editForm.get(['manufacturer'])!.value,
    };
  }
}
