import React, { useLayoutEffect } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../constants/colors';
import { useBooks } from '../context/BookContext';
import { BookDetailScreenProps } from '../navigation/types';

export default function BookDetailScreen({
  navigation,
  route,
}: BookDetailScreenProps) {
  const {
    findBook,
    borrowBook,
    returnBook,
  } = useBooks();

  const book = findBook(route.params.bookId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: book ? book.title : 'Chi tiết sách',
    });
  }, [book?.title, navigation]);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Không tìm thấy sách.</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const outOfStock = remaining === 0;

  const handleBorrow = async () => {
    const success = await borrowBook(book.id);

    if (success) {
      Alert.alert('Thành công', 'Đã ghi nhận cho mượn 1 cuốn sách.');
    } else {
      Alert.alert('Không thể cho mượn', 'Sách đã hết hoặc không còn tồn tại.');
    }
  };

  const handleReturn = async () => {
    const success = await returnBook(book.id);

    if (success) {
      Alert.alert('Thành công', 'Đã ghi nhận nhận trả 1 cuốn sách.');
    } else {
      Alert.alert('Không thể nhận trả', 'Hiện không có cuốn sách nào đang được mượn.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cover}>
          <View style={styles.bookIcon}>
            <Text style={styles.bookIconText}>BOOK</Text>
          </View>

          <Text style={styles.coverTitle}>{book.title}</Text>
          <Text style={styles.coverAuthor}>{book.author}</Text>

          <View
            style={[
              styles.statusBadge,
              outOfStock ? styles.statusEmpty : styles.statusAvailable,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                outOfStock ? styles.statusEmptyText : styles.statusAvailableText,
              ]}
            >
              {outOfStock ? 'Hết sách' : 'Còn sách'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Thông tin sách</Text>

          <InfoRow label="Tên sách" value={book.title} />
          <InfoRow label="Tác giả" value={book.author} />
          <InfoRow label="Thể loại" value={book.category} />
          <InfoRow label="Năm xuất bản" value={String(book.year)} />
          <InfoRow label="Tổng số cuốn" value={String(book.quantity)} />
          <InfoRow label="Đang được mượn" value={String(book.borrowed)} />
          <InfoRow label="Còn lại" value={String(remaining)} last />
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quản lý mượn / trả</Text>

          <Text style={styles.actionDescription}>
            Cập nhật số lượng ngay khi có phát sinh mượn hoặc trả sách.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              remaining <= 0 && styles.disabledButton,
            ]}
            activeOpacity={remaining <= 0 ? 1 : 0.75}
            disabled={remaining <= 0}
            onPress={() => void handleBorrow()}
            accessibilityRole="button"
            accessibilityState={{ disabled: remaining <= 0 }}
          >
            <Text
              style={[
                styles.primaryButtonText,
                remaining <= 0 && styles.disabledText,
              ]}
            >
              ＋  Cho mượn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.returnButton,
              book.borrowed <= 0 && styles.disabledButton,
            ]}
            activeOpacity={book.borrowed <= 0 ? 1 : 0.75}
            disabled={book.borrowed <= 0}
            onPress={() => void handleReturn()}
            accessibilityRole="button"
            accessibilityState={{ disabled: book.borrowed <= 0 }}
          >
            <Text
              style={[
                styles.returnButtonText,
                book.borrowed <= 0 && styles.disabledText,
              ]}
            >
              ✓  Nhận trả
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.75}
            onPress={() =>
              navigation.navigate('BookForm', {
                bookId: book.id,
              })
            }
          >
            <Text style={styles.editButtonText}>✎  Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({ label, value, last = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, last && styles.lastRow]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  cover: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 25,
    borderRadius: 18,
    marginBottom: 16,
  },
  bookIcon: {
    width: 64,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  bookIconText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  coverTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
  },
  coverAuthor: {
    color: '#D9EBFC',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  statusBadge: {
    marginTop: 15,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: colors.successLight,
  },
  statusEmpty: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusAvailableText: {
    color: colors.success,
  },
  statusEmptyText: {
    color: colors.danger,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '800',
    marginBottom: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 15,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    flex: 1.3,
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: -5,
    marginBottom: 15,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  returnButton: {
    minHeight: 48,
    borderRadius: 11,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  returnButtonText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  editButton: {
    minHeight: 45,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  disabledText: {
    color: colors.disabledText,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFound: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
});