import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import shouldUpdate from './shouldUpdate';

@Component({
  selector: 'ngx-headroom',
  template: `
  <div [ngStyle]="wrapperStyle" class="headroom-wrapper {{ wrapperClassName }}"
    [style.height.px]="wrapperHeight">
    <div #ref
      [@headroom]="{
        value: state,
        params: {
          duration: duration,
          easing: easing
        }
      }"
      [ngStyle]="innerStyle"
      [class]="innerClassName"
      [class.headroom]="true"
      [class.headroom--unfixed]="state === 'unfixed'"
      [class.headroom--unpinned]="state === 'unpinned'"
      [class.headroom--pinned]="state === 'pinned'"
      [class.headroom--unfixed]="state === 'unfixed'">
      <ng-content></ng-content>
    </div>
  </div>
  `,
  animations: [
    trigger('headroom', [
      state(
        'unfixed',
        style({
          transform: 'translateY(0)',
        }),
      ),
      state(
        'unpinned',
        style({
          transform: 'translateY(-100%)',
        }),
      ),
      state(
        'pinned',
        style({
          transform: 'translateY(0px)',
        }),
      ),
      transition(
        'unpinned <=> pinned',
        animate('{{ duration }}ms {{ easing }}'),
      ),
    ]),
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadroomComponent implements OnInit, AfterContentInit {
  @Input() wrapperClassName = '';
  @Input() innerClassName = '';
  @Input() innerStyle: any = {
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1',
    position: 'relative',
  };
  /**
   * pass styles for the wrapper div
   * (this maintains the components vertical space at the top of the page)
   */
  @Input() wrapperStyle: any = {};
  /** disable pinning and unpinning */
  @Input() disable = false;
  /** scroll tolerance in px when scrolling up before component is pinned */
  @Input() upTolerance = 5;
  /** scroll tolerance in px when scrolling down before component is pinned */
  @Input() downTolerance = 0;
  /**
   * height in px where the header should start and stop pinning.
   * Useful when you have another element above Headroom
   */
  @Input() pinStart = 0;
  @Input() calcHeightOnResize = true;
  /** Duration of animation in ms */
  @Input() duration = 200;
  /** Easing of animation */
  @Input() easing = 'ease-in-out';
  @Output() pin = new EventEmitter();
  @Output() unpin = new EventEmitter();
  @Output() unfix = new EventEmitter();
  @ViewChild('ref', { static: true }) inner: ElementRef;
  wrapperHeight = 0;
  currentScrollY = 0;
  lastKnownScrollY = 0;
  scrolled = false;
  resizeTicking = false;
  state = 'unfixed';
  translateY = '0px';
  height: number;
  scrollTicking = false;
  /**
   * provide a custom 'parent' element for scroll events.
   * `parent` should be a function which resolves to the desired element.
   */
  @Input() parent: () => any;
  @Input() @HostListener('window:scroll')
  scroll() {
    this.handleScroll();
  }
  @Input()
  @HostListener('window:resize')
  resize() {
    this.handleResize();
  }

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    this.innerStyle.transform = `translateY(${this.translateY})`;

    if (this.disable === true) {
      this.handleUnfix();
    }
  }
  getParent() {
    if (this.parent) {
      return this.parent();
    }
    if (this.document.documentElement && this.document.documentElement.scrollTop) {
      return this.document.documentElement;
    }
    if (this.document.body && this.document.body.scrollTop) {
      return this.document.body;
    }
    if (this.document.body && this.document.body.parentNode.scrollTop) {
      return this.document.body.parentNode;
    }
    return this.document;
  }
  ngAfterContentInit() {
    this.setHeightOffset();
    this.wrapperHeight = this.height ? this.height : null;
  }
  setHeightOffset() {
    this.height = null;
    setTimeout(() => {
      this.height = this.inner.nativeElement.offsetHeight;
      this.resizeTicking = false;
    }, 0);
  }
  getScrollY() {
    if (this.getParent().pageYOffset !== undefined) {
      return this.getParent().pageYOffset;
    }
    return this.getParent().scrollTop || 0;
  }
  getViewportHeight() {
    return (
      this.getParent().innerHeight ||
      this.document.documentElement.clientHeight ||
      this.document.body.clientHeight
    );
  }
  getDocumentHeight() {
    const body = this.document.body;
    const documentElement = this.document.documentElement;

    return Math.max(
      body.scrollHeight,
      documentElement.scrollHeight,
      body.offsetHeight,
      documentElement.offsetHeight,
      body.clientHeight,
      documentElement.clientHeight,
    );
  }
  getElementPhysicalHeight(elm: any) {
    return Math.max(elm.offsetHeight, elm.clientHeight);
  }
  getElementHeight(elm: any) {
    return Math.max(elm.scrollHeight, elm.offsetHeight, elm.clientHeight);
  }
  getScrollerPhysicalHeight() {
    const parent = this.getParent();

    return parent === this.getParent() || parent === this.document.body
      ? this.getViewportHeight()
      : this.getElementPhysicalHeight(parent);
  }
  getScrollerHeight() {
    const parent = this.getParent();

    return parent === this.getParent() || parent === this.document.body
      ? this.getDocumentHeight()
      : this.getElementHeight(parent);
  }
  isOutOfBound(currentScrollY) {
    const pastTop = currentScrollY < 0;

    const scrollerPhysicalHeight = this.getScrollerPhysicalHeight();
    const scrollerHeight = this.getScrollerHeight();

    const pastBottom = currentScrollY + scrollerPhysicalHeight > scrollerHeight;

    return pastTop || pastBottom;
  }
  handleScroll() {
    if (this.disable) {
      return;
    }
    if (!this.scrollTicking) {
      this.scrollTicking = true;
      this.update();
    }
  }
  handleResize() {
    if (this.disable || !this.calcHeightOnResize) {
      return;
    }
    if (!this.resizeTicking) {
      this.resizeTicking = true;
      this.setHeightOffset();
    }
  }
  handleUnpin() {
    this.unpin.emit();
    this.state = 'unpinned';
    this.innerStyle.position =
      this.disable || this.state === 'unfixed' ? 'relative' : 'fixed';
  }
  handlePin() {
    this.pin.emit();
    this.state = 'pinned';
    this.innerStyle.position =
      this.disable || this.state === 'unfixed' ? 'relative' : 'fixed';
  }
  handleUnfix() {
    this.unfix.emit();
    this.state = 'unfixed';
    this.innerStyle.position =
      this.disable || this.state === 'unfixed' ? 'relative' : 'fixed';
  }
  update() {
    this.currentScrollY = this.getScrollY();

    if (!this.isOutOfBound(this.currentScrollY)) {
      const { action } = shouldUpdate(
        this.lastKnownScrollY,
        this.currentScrollY,
        this.disable,
        this.pinStart,
        this.downTolerance,
        this.upTolerance,
        this.state,
        this.height,
      );

      if (action === 'pin') {
        this.handlePin();
      } else if (action === 'unpin') {
        this.handleUnpin();
      } else if (action === 'unfix') {
        this.handleUnfix();
      }
    }

    this.lastKnownScrollY = this.currentScrollY;
    this.scrollTicking = false;
  }
}
