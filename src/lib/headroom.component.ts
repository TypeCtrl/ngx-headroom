import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import shouldUpdate from './shouldUpdate';

@Component({
  selector: 'ngx-headroom',
  template: `
  <div [ngStyle]="wrapperStyle"
    [style.height.px]="wrapperHeight"
    class="headroom-wrapper {{ wrapperClassName }}"
  >
    <div #ref
      [ngStyle]="innerStyle"
      [@headroom]="{
        value: state,
        params: {
          duration: duration,
          easing: easing
        }
      }"
      [class]="innerClassName"
      [class.headroom]="true"
      [class.headroom--unfixed]="state === 'unfixed'"
      [class.headroom--unpinned]="state === 'unpinned'"
      [class.headroom--pinned]="state === 'pinned'"
      [class.headroom--unfixed]="state === 'unfixed'"
    >
      <ng-content></ng-content>
    </div>
  </div>
  `,
  animations: [
    trigger('headroom', [
      state('unfixed', style({
        transform: 'translateY(0)',
      })),
      state('unpinned', style({
        transform: 'translateY(-100%)',
      })),
      state('pinned', style({
        transform: 'translateY(0px)',
      })),
      transition('unpinned <=> pinned', animate('{{ duration }}ms {{ easing }}')),
    ]),
  ],
  preserveWhitespaces: false,
})
export class HeadroomComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @Input() wrapperClassName = '';
  @Input() innerClassName = '';
  @Input() innerStyle: any = {
    top: 0,
    left: 0,
    right: 0,
    'z-index': 1,
    position: 'relative',
  };
  @Input() wrapperStyle: any = {};
  @Input() disable = false;
  @Input() disableInlineStyles = false;
  @Input() upTolerance = 5;
  @Input() downTolerance = 0;
  @Input() pinStart = 0;
  @Input() calcHeightOnResize = true;
  /** Duration of animation in ms */
  @Input() duration = 200;
  /** Easing of animation */
  @Input() easing = 'ease-in-out';
  @Output() pin = new EventEmitter();
  @Output() unpin = new EventEmitter();
  @Output() unfix = new EventEmitter();
  @ViewChild('ref') inner: ElementRef;
  wrapperHeight = 0;
  currentScrollY = 0;
  lastKnownScrollY = 0;
  scrolled = false;
  resizeTicking = false;
  state = 'unfixed';
  translateY = '0px';
  height: number;
  scrollTicking = false;
  @Input() parent: () => any = () => window;

  constructor() {}

  ngOnInit() {
    this.innerStyle.transform = `translateY(${this.translateY})`;

    if (this.disable && !this.disable) {
      this.handleUnfix();
      this.parent().removeEventListener('scroll', this.handleScroll);
      this.parent().removeEventListener('resize', this.handleResize);
    } else if (!this.disable && this.disable) {
      this.parent().addEventListener('scroll', this.handleScroll);

      if (this.calcHeightOnResize) {
        this.parent().addEventListener('resize', this.handleResize);
      }
    }
  }
  ngAfterContentInit() {

  }
  ngAfterViewInit() {
    this.setHeightOffset();
    if (!this.disable) {
      this.parent().addEventListener('scroll', () => this.handleScroll());

      if (this.calcHeightOnResize) {
        this.parent().addEventListener('resize', () => this.handleResize());
      }
    }
    setTimeout(() => this.wrapperHeight = this.height ? this.height : null, 0);

  }
  ngOnDestroy() {
    this.parent().removeEventListener('scroll', this.handleScroll);
    this.parent().removeEventListener('scroll', this.handleScroll);
    this.parent().removeEventListener('resize', this.handleResize);
  }
  setHeightOffset() {
    this.height = this.inner.nativeElement.offsetHeight;
    this.resizeTicking = false;
  }

  getScrollY() {
    if (this.parent().pageYOffset !== undefined) {
      return this.parent().pageYOffset;
    } else if (this.parent().scrollTop !== undefined) {
      return this.parent().scrollTop;
    } else {
      const node: any = (
        document.documentElement ||
        document.body.parentNode ||
        document.body
      );
      return node.scrollTop;
    }
  }
  getViewportHeight() {
    return (
      this.parent().innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    );
  }
  getDocumentHeight() {
    const body = document.body;
    const documentElement = document.documentElement;

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
    const parent = this.parent();

    return parent === this.parent() || parent === document.body
      ? this.getViewportHeight()
      : this.getElementPhysicalHeight(parent);
  }
  getScrollerHeight() {
    const parent = this.parent();

    return parent === this.parent() || parent === document.body
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
    if (!this.scrollTicking) {
      this.scrollTicking = true;
      this.update();
    }
  }
  handleResize() {
    if (!this.resizeTicking) {
      this.resizeTicking = true;
      this.setHeightOffset();
    }
  }
  handleUnpin() {
    this.unpin.emit();
    this.state = 'unpinned';
    this.innerStyle.position = 'fixed';
  }
  handlePin() {
    this.pin.emit();
    this.state = 'pinned';
    this.innerStyle.position = 'fixed';
  }
  handleUnfix() {
    this.unfix.emit();
    this.state = 'unfixed';
    this.innerStyle.position = 'relative';
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
