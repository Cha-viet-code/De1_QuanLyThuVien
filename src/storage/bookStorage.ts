import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types/book';

const STORAGE_KEY = '@LibraryApp/books';

export const initialBooks: Book[] = [
  {
    id: 'book-1',
    title: 'Lập trình React Native',
    author: 'Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2024,
    quantity: 5,
    borrowed: 2,
  },
  {
    id: 'book-2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 1941,
    quantity: 8,
    borrowed: 0,
  },
  {
    id: 'book-3',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    year: 1988,
    quantity: 6,
    borrowed: 1,
  },
  {
    id: 'book-4',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2001,
    quantity: 4,
    borrowed: 4,
  },
  {
    id: 'book-5',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Giáo trình',
    year: 2008,
    quantity: 7,
    borrowed: 3,
  },
  {
    id: 'book-6',
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    category: 'Thiếu nhi',
    year: 1943,
    quantity: 5,
    borrowed: 0,
  },
];

export async function loadBooks(): Promise<Book[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (stored !== null) {
    const parsed: unknown = JSON.parse(stored);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item: unknown) =>
          typeof item === 'object' &&
          item !== null &&
          'id' in item &&
          'title' in item &&
          'borrowed' in item,
      )
    ) {
      return parsed as Book[];
    }

    throw new Error('Dữ liệu sách đã lưu không hợp lệ.');
  }

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialBooks),
  );

  return initialBooks;
}

export async function saveBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}