import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import json from '../lib/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(title: Title) {
    title.setTitle(`ngx-headroom ${json.version}`);
  }
  handlePin() {
    console.log('pinned');
  }
  handleUnpin() {
    console.log('unpinned');
  }
}
