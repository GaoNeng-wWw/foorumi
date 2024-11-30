import type { Index } from '../table.type';

export type Column = Index & { sort: '' | 'asc' | 'desc' };
