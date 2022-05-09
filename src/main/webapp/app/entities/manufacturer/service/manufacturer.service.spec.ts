import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IManufacturer, Manufacturer } from '../manufacturer.model';

import { ManufacturerService } from './manufacturer.service';

describe('Manufacturer Service', () => {
  let service: ManufacturerService;
  let httpMock: HttpTestingController;
  let elemDefault: IManufacturer;
  let expectedResult: IManufacturer | IManufacturer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ManufacturerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      companyName: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Manufacturer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Manufacturer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Manufacturer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          companyName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Manufacturer', () => {
      const patchObject = Object.assign({}, new Manufacturer());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Manufacturer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          companyName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Manufacturer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addManufacturerToCollectionIfMissing', () => {
      it('should add a Manufacturer to an empty array', () => {
        const manufacturer: IManufacturer = { id: 123 };
        expectedResult = service.addManufacturerToCollectionIfMissing([], manufacturer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should not add a Manufacturer to an array that contains it', () => {
        const manufacturer: IManufacturer = { id: 123 };
        const manufacturerCollection: IManufacturer[] = [
          {
            ...manufacturer,
          },
          { id: 456 },
        ];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, manufacturer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Manufacturer to an array that doesn't contain it", () => {
        const manufacturer: IManufacturer = { id: 123 };
        const manufacturerCollection: IManufacturer[] = [{ id: 456 }];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, manufacturer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should add only unique Manufacturer to an array', () => {
        const manufacturerArray: IManufacturer[] = [{ id: 123 }, { id: 456 }, { id: 87835 }];
        const manufacturerCollection: IManufacturer[] = [{ id: 123 }];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, ...manufacturerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const manufacturer: IManufacturer = { id: 123 };
        const manufacturer2: IManufacturer = { id: 456 };
        expectedResult = service.addManufacturerToCollectionIfMissing([], manufacturer, manufacturer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manufacturer);
        expect(expectedResult).toContain(manufacturer2);
      });

      it('should accept null and undefined values', () => {
        const manufacturer: IManufacturer = { id: 123 };
        expectedResult = service.addManufacturerToCollectionIfMissing([], null, manufacturer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should return initial array if no Manufacturer is added', () => {
        const manufacturerCollection: IManufacturer[] = [{ id: 123 }];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, undefined, null);
        expect(expectedResult).toEqual(manufacturerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
