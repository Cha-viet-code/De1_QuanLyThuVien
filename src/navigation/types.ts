import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  BookList: undefined;
  BookForm: {
    bookId?: string;
  };
  BookDetail: {
    bookId: string;
  };
};

export type BookListScreenProps =
  NativeStackScreenProps<RootStackParamList, 'BookList'>;

export type BookFormScreenProps =
  NativeStackScreenProps<RootStackParamList, 'BookForm'>;

export type BookDetailScreenProps =
  NativeStackScreenProps<RootStackParamList, 'BookDetail'>;