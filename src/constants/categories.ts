import { BOOK_CATEGORIES, BookCategory } from '../types/book';

export const FILTER_CATEGORIES: Array<
  'Tất cả' | BookCategory
> = ['Tất cả', ...BOOK_CATEGORIES];