import React, { useEffect, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../constants/colors';
import { useBooks } from '../context/BookContext';
import { BookFormScreenProps } from '../navigation/types';
import { BOOK_CATEGORIES, BookCategory, BookFormErrors, BookInput } from '../types/book';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'numeric';
  maxLength?: number;
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  maxLength,
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[styles.input, error ? styles.inputError : null]}
        accessibilityLabel={label}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export default function BookFormScreen({
  navigation,
  route,
}: BookFormScreenProps) {
  const { books, addBook, updateBook, findBook } = useBooks();
  const bookId = route.params?.bookId;
  const editingBook = bookId ? findBook(bookId) : undefined;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] =
    useState<BookCategory>('Giáo trình');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (bookId && !editingBook) {
      Alert.alert('Không tìm thấy sách', 'Sách có thể đã bị xóa.', [
        { text: 'Đóng', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setCategory(editingBook.category);
      setYear(String(editingBook.year));
      setQuantity(String(editingBook.quantity));
    }
  }, [bookId, editingBook, navigation]);

  const validate = (): boolean => {
    const next: BookFormErrors = {};
    const currentYear = new Date().getFullYear();

    if (!title.trim()) {
      next.title = 'Vui lòng nhập tên sách.';
    }

    if (!author.trim()) {
      next.author = 'Vui lòng nhập tên tác giả.';
    }

    const parsedYear = Number(year);
    if (
      year.trim() === '' ||
      !Number.isInteger(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > currentYear
    ) {
      next.year = `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }

    const parsedQuantity = Number(quantity);
    if (
      quantity.trim() === '' ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      next.quantity = 'Số lượng phải là số nguyên lớn hơn 0.';
    } else if (
      editingBook &&
      parsedQuantity < editingBook.borrowed
    ) {
      next.quantity =
        `Số lượng không được nhỏ hơn ${editingBook.borrowed} ` +
        'cuốn đang được mượn.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const changeField = (
    field: keyof BookInput,
    value: string,
  ) => {
    if (field === 'title') setTitle(value);
    if (field === 'author') setAuthor(value);
    if (field === 'year') setYear(value);
    if (field === 'quantity') setQuantity(value);

    if (submitted) {
      setErrors(previous => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    setSubmitted(true);

    if (!validate()) {
      return;
    }

    const input: BookInput = {
      title: title.trim(),
      author: author.trim(),
      category,
      year: Number(year),
      quantity: Number(quantity),
    };

    try {
      if (bookId) {
        const currentBook = findBook(bookId);

        if (!currentBook) {
          Alert.alert('Lỗi', 'Sách không còn tồn tại.');
          return;
        }

        if (input.quantity < currentBook.borrowed) {
          setErrors(previous => ({
            ...previous,
            quantity:
              `Số lượng không được nhỏ hơn ${currentBook.borrowed} cuốn đang mượn.`,
          }));
          return;
        }

        await updateBook(bookId, input);
      } else {
        await addBook(input);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin sách.');
    }
  };

  if (bookId && !editingBook) {
    return <View style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>
            {bookId ? 'Cập nhật thông tin' : 'Thông tin sách mới'}
          </Text>

          <Text style={styles.subtitle}>
            Vui lòng điền đầy đủ thông tin có dấu *.
          </Text>

          <View style={styles.formCard}>
            <FormField
              label="Tên sách *"
              value={title}
              onChangeText={value => changeField('title', value)}
              placeholder="Nhập tên sách"
              error={errors.title}
              maxLength={150}
            />

            <FormField
              label="Tác giả *"
              value={author}
              onChangeText={value => changeField('author', value)}
              placeholder="Nhập tên tác giả"
              error={errors.author}
              maxLength={100}
            />

            <Text style={styles.label}>Thể loại *</Text>

            <View style={styles.categoryGrid}>
              {BOOK_CATEGORIES.map(item => {
                const selected = category === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.75}
                    onPress={() => setCategory(item)}
                    style={[
                      styles.categoryOption,
                      selected && styles.categorySelected,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.categoryLabel,
                        selected && styles.categoryLabelSelected,
                      ]}
                    >
                      {selected ? '✓ ' : ''}
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <FormField
              label="Năm xuất bản *"
              value={year}
              onChangeText={value => changeField('year', value)}
              placeholder="Ví dụ: 2024"
              error={errors.year}
              keyboardType="numeric"
              maxLength={4}
            />

            <FormField
              label="Tổng số cuốn *"
              value={quantity}
              onChangeText={value => changeField('quantity', value)}
              placeholder="Ví dụ: 10"
              error={errors.quantity}
              keyboardType="numeric"
              maxLength={6}
            />

            {editingBook && (
              <View style={styles.borrowInfo}>
                <Text style={styles.borrowInfoText}>
                  Đang mượn: {editingBook.borrowed} cuốn.
                  Số lượng mới không được thấp hơn số này.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={() => void handleSave()}
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>
                {bookId ? 'Lưu thay đổi' : '＋  Thêm sách'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 18,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 5,
    lineHeight: 17,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  categorySelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: colors.primaryDark,
  },
  borrowInfo: {
    padding: 11,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    marginBottom: 18,
  },
  borrowInfoText: {
    color: colors.primaryDark,
    fontSize: 12,
    lineHeight: 19,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 6,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});