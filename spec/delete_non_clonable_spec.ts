import deleteNonClonable from '../delete_non_clonable';

describe('#deleteNonClonable', () => {
  const blob = new Blob;
  it('does not crash', () => {
    expect(deleteNonClonable(function() {})).toEqual({});
  });

  it('returns primitives', () => {
    expect(deleteNonClonable(true)).toEqual(true);
    expect(deleteNonClonable(91)).toEqual(91);
    expect(deleteNonClonable('91')).toEqual('91');
  });

  it('returns other compatible objects', () => {
    expect(deleteNonClonable(/91/)).toEqual(/91/);
    expect(deleteNonClonable(blob)).toEqual(blob);
    const array = new Int32Array(1);
    expect(deleteNonClonable(array)).toEqual(array);
  });

  it('filters arrays', () => {
    expect(deleteNonClonable(['a', blob, function() {}])).toEqual(['a', jasmine.any(Blob)]);
  });

  it('filters sets', () => {
    expect(deleteNonClonable(new Set(['a', blob, function() {}]))).toEqual(new Set(['a', blob, {}]));
  });

  it('filters objects', () => {
    const result = deleteNonClonable({
      a: 'a',
      b: blob,
      c: function() {}
    });
    expect(result).toEqual({
      a: 'a',
      b: blob
    });
    expect(result.c).toBeUndefined();
  });

  it('filters maps', () => {
    const original = new Map;
    const fn = function() {};
    original.set('a', 'b');
    original.set(blob, blob);
    original.set(fn, 5);
    original.set('x', function() {});
    const result = deleteNonClonable(original);
    expect(result.get('a')).toBe('b');
    expect(result.get(blob)).toBe(blob);
    expect(result.has(fn)).toBeFalsy();
    expect(result.has('x')).toBeFalsy();
  });

  it('blows up fast on circular references', () => {
    interface Recursive {
      circular: Array<Circular>;
    }
    interface Circular {
      recursive: Recursive;
    }
    const circular : Circular = { recursive: { circular: [] } };
    circular.recursive.circular = [circular];
    expect(() => deleteNonClonable(circular)).toThrowError('Possible infinite recursion in postMessage argument.');
  });
});
