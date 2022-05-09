import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBeer, Beer } from '../beer.model';

import { BeerService } from './beer.service';

describe('Beer Service', () => {
  let service: BeerService;
  let httpMock: HttpTestingController;
  let elemDefault: IBeer;
  let expectedResult: IBeer | IBeer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BeerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      price: 0,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
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

    it('should create a Beer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Beer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Beer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          price: 1,
          image: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Beer', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new Beer()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Beer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          price: 1,
          image: 'BBBBBB',
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

    it('should delete a Beer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBeerToCollectionIfMissing', () => {
      it('should add a Beer to an empty array', () => {
        const beer: IBeer = { id: 123 };
        expectedResult = service.addBeerToCollectionIfMissing([], beer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(beer);
      });

      it('should not add a Beer to an array that contains it', () => {
        const beer: IBeer = { id: 123 };
        const beerCollection: IBeer[] = [
          {
            ...beer,
          },
          { id: 456 },
        ];
        expectedResult = service.addBeerToCollectionIfMissing(beerCollection, beer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Beer to an array that doesn't contain it", () => {
        const beer: IBeer = { id: 123 };
        const beerCollection: IBeer[] = [{ id: 456 }];
        expectedResult = service.addBeerToCollectionIfMissing(beerCollection, beer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(beer);
      });

      it('should add only unique Beer to an array', () => {
        const beerArray: IBeer[] = [{ id: 123 }, { id: 456 }, { id: 77970 }];
        const beerCollection: IBeer[] = [{ id: 123 }];
        expectedResult = service.addBeerToCollectionIfMissing(beerCollection, ...beerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const beer: IBeer = { id: 123 };
        const beer2: IBeer = { id: 456 };
        expectedResult = service.addBeerToCollectionIfMissing([], beer, beer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(beer);
        expect(expectedResult).toContain(beer2);
      });

      it('should accept null and undefined values', () => {
        const beer: IBeer = { id: 123 };
        expectedResult = service.addBeerToCollectionIfMissing([], null, beer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(beer);
      });

      it('should return initial array if no Beer is added', () => {
        const beerCollection: IBeer[] = [{ id: 123 }];
        expectedResult = service.addBeerToCollectionIfMissing(beerCollection, undefined, null);
        expect(expectedResult).toEqual(beerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
