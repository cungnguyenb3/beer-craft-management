import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManufacturerDetailComponent } from './manufacturer-detail.component';

describe('Manufacturer Management Detail Component', () => {
  let comp: ManufacturerDetailComponent;
  let fixture: ComponentFixture<ManufacturerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ manufacturer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ManufacturerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ManufacturerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load manufacturer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.manufacturer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
