import shouldUpdate from './shouldUpdate';

let disable = false;
let pinStart = 0;
let downTolerance = 0;
let upTolerance = 0;

describe('shouldUpdate', () => {
  beforeEach(() => {
    disable = false;
    pinStart = 0;
    downTolerance = 0;
    upTolerance = 0;
  });

  it('should exist', () => {
    expect(shouldUpdate).toBeTruthy();
  });

  it('should return an object', () => {
    expect(shouldUpdate()).toEqual(jasmine.any(Object));
  });

  // Test scrolling direction detection.
  it('should report scrolling down when currentScroll is greater than lastKnownScrollY', () => {
    expect(shouldUpdate(0, 10).scrollDirection).toEqual('down');
  });

  it('should report scrolling upwhen currentScroll is less than lastKnownScrollY', () => {
    expect(shouldUpdate(10, 0).scrollDirection).toEqual('up');
  });

  // Test action logic.
  it('should return an action of "none" if scrolling down and already unpinned', () => {
    const height = 0;
    const state = 'unpinned';

    const result = shouldUpdate(
      0,
      10,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('none');
  });

  it('should return an action of "none" if scrolling up and already pinned', () => {
    const height = 0;
    const state = 'pinned';

    const result = shouldUpdate(
      100,
      90,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('none');
  });

  it('should return an action of `unpin` if scrolling down and pinned', () => {
    const height = 0;
    const state = 'pinned';

    const result = shouldUpdate(
      0,
      10,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('unpin');
  });

  it(
    'should not return an action of `unpin` if scrolling down and unfixed ' +
      'but the scrolling amount is less than pinStart',
    () => {
      pinStart = 200;
      const height = 0;
      const state = 'unfixed';

      const result = shouldUpdate(
        100,
        110,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('none');
    },
  );

  it(
    'should not return an action of `unpin` if scrolling down and pinned ' +
      'but the scrolling amount is less than downTolerance',
    () => {
      downTolerance = 1000;
      const height = 0;
      const state = 'pinned';
      const result = shouldUpdate(
        100,
        110,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('none');
    },
  );

  it('should return an action of `pin` if scrolling up and unpinned', () => {
    const height = 0;
    const state = 'unpinned';
    const result = shouldUpdate(
      10,
      1,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('pin');
  });

  it(
    'should not return an action of `pin` if scrolling up and unpinned' +
      'but the scrolling amount is less than upTolerance',
    () => {
      upTolerance = 1000;
      const height = 0;
      const state = 'unpinned';
      const result = shouldUpdate(
        110,
        100,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('none');
    },
  );

  it('should return an action of \'none\' if haven\'t scrolled past height of header', () => {
    const height = 100;
    const state = 'unfixed';
    const result = shouldUpdate(
      0,
      10,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('none');
  });

  it(
    'should return an action of `none` if scrolling up ' +
      'when pinned within height of header',
    () => {
      const height = 100;
      const state = 'pinned';
      const result = shouldUpdate(
        50,
        10,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('none');
    },
  );

  it(
    'should return an action of `pin` if scrolling up when unpinned within height of header ' +
      'regardless of the upTolerance value',
    () => {
      upTolerance = 1000;
      let height = 100;
      let state = 'unpinned';
      let result = shouldUpdate(
        50,
        10,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );

      expect(result.action).toEqual('pin');

      height = 100;
      state = 'unpinned';
      result = shouldUpdate(
        50,
        1,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('pin');
    },
  );

  it(
    'should return an action of `none` if scrolling down ' +
      'when pinned within height of header',
    () => {
      const height = 100;
      const state = 'pinned';
      const result = shouldUpdate(
        50,
        80,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );
      expect(result.action).toEqual('none');
    },
  );

  it(
    'should return an action of `none` if scrolling up ' +
      'when pinned within height of header or at the top',
    () => {
      const height = 100;
      const state = 'pinned';
      const result = shouldUpdate(
        100,
        1,
        disable,
        pinStart,
        downTolerance,
        upTolerance,
        state,
        height,
      );

      expect(result.action).toEqual('none');
    },
  );

  it('should return an action of \'unfix\' if currentScroll is less than or equal to pinStart', () => {
    pinStart = 20;

    const height = 100;
    const state = 'pinned';
    let result = shouldUpdate(
      100,
      10,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );

    expect(result.action).toEqual('unfix');

    result = shouldUpdate(
      100,
      20,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );

    expect(result.action).toEqual('unfix');
  });

  it('should not return an action of \'unfix\' if currentScroll is more than pinStart', () => {
    pinStart = 20;
    const height = 100;
    const state = 'pinned';
    const result = shouldUpdate(
      100,
      50,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );

    expect(result.action).toEqual('none');
  });

  it('should return an action of \'unpin\' if scroll down past height of header', () => {
    const height = 100;
    const state = 'unfixed';
    const result = shouldUpdate(
      100,
      110,
      disable,
      pinStart,
      downTolerance,
      upTolerance,
      state,
      height,
    );
    expect(result.action).toEqual('unpin');
  });
});
