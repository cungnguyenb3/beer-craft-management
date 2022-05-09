import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BeerService } from '../service/beer.service';
import { IBeer, Beer } from '../beer.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';
import { ManufacturerService } from 'app/entities/manufacturer/service/manufacturer.service';

import { BeerUpdateComponent } from './beer-update.component';

describe('Beer Management Update Component', () => {
  let comp: BeerUpdateComponent;
  let fixture: ComponentFixture<BeerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let beerService: BeerService;
  let categoryService: CategoryService;
  let manufacturerService: ManufacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BeerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BeerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BeerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    beerService = TestBed.inject(BeerService);
    categoryService = TestBed.inject(CategoryService);
    manufacturerService = TestBed.inject(ManufacturerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const beer: IBeer = { id: 456 };
      const category: ICategory = { id: 31039 };
      beer.category = category;

      const categoryCollection: ICategory[] = [{ id: 20889 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Manufacturer query and add missing value', () => {
      const beer: IBeer = { id: 456 };
      const manufacturer: IManufacturer = { id: 92396 };
      beer.manufacturer = manufacturer;

      const manufacturerCollection: IManufacturer[] = [{ id: 47262 }];
      jest.spyOn(manufacturerService, 'query').mockReturnValue(of(new HttpResponse({ body: manufacturerCollection })));
      const additionalManufacturers = [manufacturer];
      const expectedCollection: IManufacturer[] = [...additionalManufacturers, ...manufacturerCollection];
      jest.spyOn(manufacturerService, 'addManufacturerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      expect(manufacturerService.query).toHaveBeenCalled();
      expect(manufacturerService.addManufacturerToCollectionIfMissing).toHaveBeenCalledWith(
        manufacturerCollection,
        ...additionalManufacturers
      );
      expect(comp.manufacturersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const beer: IBeer = { id: 456 };
      const category: ICategory = { id: 79350 };
      beer.category = category;
      const manufacturer: IManufacturer = { id: 43365 };
      beer.manufacturer = manufacturer;

      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(beer));
      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.manufacturersSharedCollection).toContain(manufacturer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beer>>();
      const beer = { id: 123 };
      jest.spyOn(beerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: beer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(beerService.update).toHaveBeenCalledWith(beer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beer>>();
      const beer = new Beer();
      jest.spyOn(beerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: beer }));
      saveSubject.complete();

      // THEN
      expect(beerService.create).toHaveBeenCalledWith(beer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Beer>>();
      const beer = { id: 123 };
      jest.spyOn(beerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ beer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(beerService.update).toHaveBeenCalledWith(beer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCategoryById', () => {
      it('Should return tracked Category primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategoryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackManufacturerById', () => {
      it('Should return tracked Manufacturer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackManufacturerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
