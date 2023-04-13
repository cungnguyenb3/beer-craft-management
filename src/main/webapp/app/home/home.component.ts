import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  firebaseConfig = {
    apiKey: 'AIzaSyAgWfa6LJGBW3PfBEcpb1M-8WTKP3wFiK4',
    authDomain: 'fluted-depth-362515.firebaseapp.com',
    projectId: 'fluted-depth-362515',
    storageBucket: 'fluted-depth-362515.appspot.com',
    messagingSenderId: '147801621083',
    appId: '1:147801621083:web:50f9085327535af588357e',
  };
  app: any;
  messaging: any;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.app = initializeApp(this.firebaseConfig);
    this.messaging = getMessaging(this.app);
    // this.getToken(this.messaging)
    getToken(this.messaging, { vapidKey: 'BFSzaLNc9oqaXU6dgCFYKC3E-S_o7fnRc_I97i93r3HVU9Ven-6_1D65IugkRQAUxKTJz9nJXpLtZ9lKk6UbmOU' }).then(
      currentToken => {
        if (currentToken) {
          console.log('current token', currentToken);
        } else {
          console.log('Can not get token');
        }
      }
    );
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
