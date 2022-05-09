import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PassportDetailComponent } from './passport-detail.component';

describe('Passport Management Detail Component', () => {
  let comp: PassportDetailComponent;
  let fixture: ComponentFixture<PassportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassportDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ passport: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PassportDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PassportDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load passport on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.passport).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
