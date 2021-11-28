import { TestBed, waitForAsync } from '@angular/core/testing';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';

import { HeadroomModule } from '../lib/public_api';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, AppFooterComponent],
      imports: [NtkmeButtonModule, HeadroomModule],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
