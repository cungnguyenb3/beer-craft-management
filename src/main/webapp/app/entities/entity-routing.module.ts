import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: { pageTitle: 'Countries' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'manufacturer',
        data: { pageTitle: 'Manufacturers' },
        loadChildren: () => import('./manufacturer/manufacturer.module').then(m => m.ManufacturerModule),
      },
      {
        path: 'member',
        data: { pageTitle: 'Members' },
        loadChildren: () => import('./member/member.module').then(m => m.MemberModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'Categories' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'beer',
        data: { pageTitle: 'Beers' },
        loadChildren: () => import('./beer/beer.module').then(m => m.BeerModule),
      },
      {
        path: 'passport',
        data: { pageTitle: 'Passports' },
        loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
