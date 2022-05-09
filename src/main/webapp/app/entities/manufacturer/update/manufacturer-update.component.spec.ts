import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ManufacturerService } from '../service/manufacturer.service';
import { IManufacturer, Manufacturer } from '../manufacturer.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

import { ManufacturerUpdateComponent } from './manufacturer-update.component';

describe('Manufacturer Management Update Component', () => {
  let comp: ManufacturerUpdateComponent;
  let fixture: ComponentFixture<ManufacturerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let manufacturerService: ManufacturerService;
  let countryService: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ManufacturerUpdateComponent],
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
      .overrideTemplate(ManufacturerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    manufacturerService = TestBed.inject(ManufacturerService);
    countryService = TestBed.inject(CountryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Country query and add missing value', () => {
      const manufacturer: IManufacturer = { id: 456 };
      const country: ICountry = { id: 37682 };
      manufacturer.country = country;

      const countryCollection: ICountry[] = [{ id: 21620 }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [country];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, ...additionalCountries);
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const manufacturer: IManufacturer = { id: 456 };
      const country: ICountry = { id: 66271 };
      manufacturer.country = country;

      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(manufacturer));
      expect(comp.countriesSharedCollection).toContain(country);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Manufacturer>>();
      const manufacturer = { id: 123 };
      jest.spyOn(manufacturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manufacturer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(manufacturerService.update).toHaveBeenCalledWith(manufacturer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Manufacturer>>();
      const manufacturer = new Manufacturer();
      jest.spyOn(manufacturerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manufacturer }));
      saveSubject.complete();

      // THEN
      expect(manufacturerService.create).toHaveBeenCalledWith(manufacturer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Manufacturer>>();
      const manufacturer = { id: 123 };
      jest.spyOn(manufacturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(manufacturerService.update).toHaveBeenCalledWith(manufacturer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCountryById', () => {
      it('Should return tracked Country primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCountryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
