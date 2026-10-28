import React, { useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import colors from '../constants/colors';
import { useBooks } from '../context/BookContext';
import { BookListScreenProps } from '../navigation/types';
import { BookCategory } from '../types/book';

type SelectedCategory = 'Tất cả' | BookCategory;

export default function BookListScreen({
  navigation,
}: BookListScreenProps) {
  const { books, loading, error, deleteBook } = useBooks();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] =
    useState<SelectedCategory>('Tất cả');

  const totalBorrowed = useMemo(
    () => books.reduce((sum, book) => sum + book.borrowed, 0),
    [books],
  );

  const filteredBooks = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase('vi');

    return books.filter(book => {
      const matchesKeyword =
        book.title.toLocaleLowerCase('vi').includes(normalized) ||
        book.author.toLocaleLowerCase('vi').includes(normalized);

      const matchesCategory =
        category === 'Tất cả' || book.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [books, keyword, category]);

  const confirmDelete = (bookId: string, title: string) => {
    Alert.alert(
      'Xác nhận xóa sách',
      `Bạn có chắc chắn muốn xóa "${title}" khỏi thư viện?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            void deleteBook(bookId);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu sách...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() =>
              navigation.navigate('BookDetail', {
                bookId: item.id,
              })
            }
            onLongPress={() => confirmDelete(item.id, item.title)}
          />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.welcome}>
              <Text style={styles.eyebrow}>QUẢN LÝ THƯ VIỆN</Text>
              <Text style={styles.heading}>Kho sách của bạn</Text>
              <Text style={styles.subtitle}>
                Theo dõi sách, mượn và trả sách dễ dàng.
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Tổng đầu sách</Text>
                <Text style={styles.statNumber}>{books.length}</Text>
                <Text style={styles.statCaption}>Đầu sách</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Đang được mượn</Text>
                <Text style={[styles.statNumber, styles.borrowedNumber]}>
                  {totalBorrowed}
                </Text>
                <Text style={styles.statCaption}>Cuốn sách</Text>
              </View>
            </View>

            <SearchBar
              value={keyword}
              onChangeText={setKeyword}
            />

            <Text style={styles.sectionTitle}>Thể loại sách</Text>

            <CategoryFilter
              selected={category}
              onSelect={setCategory}
            />

            <View style={styles.listHeading}>
              <Text style={styles.sectionTitle}>Danh sách sách</Text>
              <Text style={styles.resultCount}>
                {filteredBooks.length} kết quả
              </Text>
            </View>

            {error !== null && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>▤</Text>
            <Text style={styles.emptyTitle}>
              {books.length === 0
                ? 'Thư viện chưa có sách'
                : 'Không tìm thấy sách'}
            </Text>
            <Text style={styles.emptyText}>
              {books.length === 0
                ? 'Nhấn nút bên dưới để thêm sách đầu tiên.'
                : 'Thử từ khóa khác hoặc thay đổi bộ lọc.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerHint}>
              Nhấn vào sách để xem chi tiết · Nhấn giữ để xóa
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BookForm', {})}
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>＋  Thêm sách</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  welcome: {
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heading: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statNumber: {
    color: colors.primary,
    fontSize: 29,
    fontWeight: '800',
    marginTop: 7,
  },
  borrowedNumber: {
    color: colors.secondary,
  },
  statCaption: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorText: {
    color: colors.danger,
    marginBottom: 12,
    fontSize: 12,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    fontSize: 36,
    color: colors.primary,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  footer: {
    paddingTop: 8,
    paddingBottom: 14,
  },
  footerHint: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 11,
  },
  addButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    backgroundColor: colors.primary,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 13,
  },
});