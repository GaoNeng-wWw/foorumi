import { describe, expect, it } from 'vitest';
import { Literal, And, Subset, Or } from '../permission-tree';

describe('permission-tree', () => {
  it('literal', () => {
    const v1 = Literal(true);
    expect(typeof v1).toBe('function');
    expect(v1()).toBe(true);
  });
  describe('and', () => {
    it('no nest', () => {
      const r = And(
        Literal(true),
        Literal(false),
      );
      expect(r()).toBe(false);
    });
    it('nest', () => {
      const r = And(
        And(
          Literal(true as const),
          Literal(true as const),
        ),
        Literal(false),
      );
      expect(r()).toBe(false);
    });
  });
  it('or', () => {
    expect(
      Or(
        Literal(false),
        Literal(true),
      )(),
    ).toBe(true);
  });
  describe('subset', () => {
    it('no nest', () => {
      const res = Subset(
        Literal([1, 2]),
        Literal([1, 2, 3]),
      );
      expect(res()).toBe(true);
    });
    it('nest', () => {
      const r = And(
        Subset(
          Literal([1, 2]),
          Literal([1, 2, 3]),
        ),
        Subset(
          Literal([4]),
          Literal([5]),
        ),
      );
      expect(r()).toBeFalsy();
    });
  });
});
