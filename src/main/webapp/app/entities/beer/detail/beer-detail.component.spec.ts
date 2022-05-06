import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BeerDetailComponent } from './beer-detail.component';

describe('Beer Management Detail Component', () => {
  let comp: BeerDetailComponent;
  let fixture: ComponentFixture<BeerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ beer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BeerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BeerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load beer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.beer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
