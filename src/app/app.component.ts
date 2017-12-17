import { Component } from '@angular/core';

import json from '../lib/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app';
  handlePin() {
    console.log('pinned');
  }
  handleUnpin() {
    console.log('unpinned');
  }
}
