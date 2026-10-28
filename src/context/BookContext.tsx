import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Alert } from 'react-native';
import { Book, BookInput } from '../types/book';
import { loadBooks, saveBooks } from '../storage/bookStorage';

interface BookContextValue {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (input: BookInput) => Promise<void>;
  updateBook: (id: string, input: BookInput) => Promise<void>;
  deleteBook: (id: string) => Promise<boolean>;
  borrowBook: (id: string) => Promise<boolean>;
  returnBook: (id: string) => Promise<boolean>;
  findBook: (id: string) => Book | undefined;
}

const BookContext = createContext<BookContextValue | undefined>(
  undefined,
);

export function BookProvider({
  children,
}: React.PropsWithChildren) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    loadBooks()
      .then(data => {
        if (active) {
          setBooks(data);
          setError(null);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active) {
          setError('Không thể tải dữ liệu sách. Vui lòng thử lại.');
          Alert.alert(
            'Lỗi dữ liệu',
            'Không thể đọc dữ liệu sách đã lưu. Hãy khởi động lại ứng dụng sau khi kiểm tra bộ nhớ.',
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    saveBooks(books).catch(() => {
      setError('Không thể lưu dữ liệu. Hãy kiểm tra bộ nhớ thiết bị.');
    });
  }, [books, loaded]);

  const addBook = useCallback(async (input: BookInput) => {
    const newBook: Book = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      borrowed: 0,
    };

    setBooks(previous => [...previous, newBook]);
  }, []);

  const updateBook = useCallback(
    async (id: string, input: BookInput) => {
      setBooks(previous =>
        previous.map(book =>
          book.id === id ? { ...book, ...input } : book,
        ),
      );
    },
    [],
  );

  const deleteBook = useCallback(async (id: string) => {
    const target = books.find(book => book.id === id);

    if (!target) {
      return false;
    }

    if (target.borrowed > 0) {
      Alert.alert(
        'Không thể xóa',
        `Sách "${target.title}" đang có ${target.borrowed} cuốn được mượn.`,
      );
      return false;
    }

    setBooks(previous => previous.filter(book => book.id !== id));
    return true;
  }, [books]);

  const borrowBook = useCallback(async (id: string) => {
    const target = books.find(book => book.id === id);

    if (!target || target.borrowed >= target.quantity) {
      return false;
    }

    setBooks(previous =>
      previous.map(book =>
        book.id === id
          ? { ...book, borrowed: book.borrowed + 1 }
          : book,
      ),
    );

    return true;
  }, [books]);

  const returnBook = useCallback(async (id: string) => {
    const target = books.find(book => book.id === id);

    if (!target || target.borrowed <= 0) {
      return false;
    }

    setBooks(previous =>
      previous.map(book =>
        book.id === id
          ? { ...book, borrowed: book.borrowed - 1 }
          : book,
      ),
    );

    return true;
  }, [books]);

  const findBook = useCallback(
    (id: string) => books.find(book => book.id === id),
    [books],
  );

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        findBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks(): BookContextValue {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error('useBooks phải được dùng bên trong BookProvider.');
  }

  return context;
}