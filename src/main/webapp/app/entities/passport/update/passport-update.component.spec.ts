import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PassportService } from '../service/passport.service';
import { IPassport, Passport } from '../passport.model';
import { IMember } from 'app/entities/member/member.model';
import { MemberService } from 'app/entities/member/service/member.service';
import { IBeer } from 'app/entities/beer/beer.model';
import { BeerService } from 'app/entities/beer/service/beer.service';

import { PassportUpdateComponent } from './passport-update.component';

describe('Passport Management Update Component', () => {
  let comp: PassportUpdateComponent;
  let fixture: ComponentFixture<PassportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let passportService: PassportService;
  let memberService: MemberService;
  let beerService: BeerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PassportUpdateComponent],
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
      .overrideTemplate(PassportUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PassportUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    passportService = TestBed.inject(PassportService);
    memberService = TestBed.inject(MemberService);
    beerService = TestBed.inject(BeerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call member query and add missing value', () => {
      const passport: IPassport = { id: 456 };
      const member: IMember = { id: 22852 };
      passport.member = member;

      const memberCollection: IMember[] = [{ id: 83270 }];
      jest.spyOn(memberService, 'query').mockReturnValue(of(new HttpResponse({ body: memberCollection })));
      const expectedCollection: IMember[] = [member, ...memberCollection];
      jest.spyOn(memberService, 'addMemberToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      expect(memberService.query).toHaveBeenCalled();
      expect(memberService.addMemberToCollectionIfMissing).toHaveBeenCalledWith(memberCollection, member);
      expect(comp.membersCollection).toEqual(expectedCollection);
    });

    it('Should call Beer query and add missing value', () => {
      const passport: IPassport = { id: 456 };
      const beer: IBeer = { id: 88906 };
      passport.beer = beer;

      const beerCollection: IBeer[] = [{ id: 61879 }];
      jest.spyOn(beerService, 'query').mockReturnValue(of(new HttpResponse({ body: beerCollection })));
      const additionalBeers = [beer];
      const expectedCollection: IBeer[] = [...additionalBeers, ...beerCollection];
      jest.spyOn(beerService, 'addBeerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      expect(beerService.query).toHaveBeenCalled();
      expect(beerService.addBeerToCollectionIfMissing).toHaveBeenCalledWith(beerCollection, ...additionalBeers);
      expect(comp.beersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const passport: IPassport = { id: 456 };
      const member: IMember = { id: 92853 };
      passport.member = member;
      const beer: IBeer = { id: 73755 };
      passport.beer = beer;

      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(passport));
      expect(comp.membersCollection).toContain(member);
      expect(comp.beersSharedCollection).toContain(beer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Passport>>();
      const passport = { id: 123 };
      jest.spyOn(passportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: passport }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(passportService.update).toHaveBeenCalledWith(passport);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Passport>>();
      const passport = new Passport();
      jest.spyOn(passportService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: passport }));
      saveSubject.complete();

      // THEN
      expect(passportService.create).toHaveBeenCalledWith(passport);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Passport>>();
      const passport = { id: 123 };
      jest.spyOn(passportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ passport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(passportService.update).toHaveBeenCalledWith(passport);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackMemberById', () => {
      it('Should return tracked Member primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMemberById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBeerById', () => {
      it('Should return tracked Beer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBeerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
