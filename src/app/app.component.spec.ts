import { async, TestBed } from '@angular/core/testing';

import { NtkmeButtonModule } from '@ctrl/ngx-github-buttons';
import { ButtonService } from '@ctrl/ngx-github-buttons';
import { of as ObservableOf } from 'rxjs';

import { HeadroomModule } from '../lib/public_api';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppComponent } from './app.component';

class FakeButtonService {
  repo(user: string, repo: string) {
    return ObservableOf({ stargazers_count: 0 });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, AppFooterComponent],
      imports: [NtkmeButtonModule, HeadroomModule],
      providers: [{ provide: ButtonService, useClass: FakeButtonService }],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
