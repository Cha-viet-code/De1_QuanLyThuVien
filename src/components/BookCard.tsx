import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../constants/colors';
import { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export default function BookCard({
  book,
  onPress,
  onLongPress,
}: BookCardProps) {
  const remaining = book.quantity - book.borrowed;
  const isEmpty = remaining === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.78}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}, tác giả ${book.author}`}
    >
      <View style={styles.accent} />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>{book.title}</Text>

          {isEmpty && (
            <View style={styles.outBadge}>
              <Text style={styles.outText}>Hết sách</Text>
            </View>
          )}
        </View>

        <Text style={styles.author}>Tác giả: {book.author}</Text>

        <View style={styles.footer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {book.category}
            </Text>
          </View>

          <Text
            style={[
              styles.remaining,
              isEmpty && styles.remainingEmpty,
            ]}
          >
            Còn {remaining}/{book.quantity} cuốn
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  accent: {
    width: 5,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  author: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '600',
  },
  remaining: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  remainingEmpty: {
    color: colors.danger,
  },
  outBadge: {
    backgroundColor: colors.dangerLight,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  outText: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '700',
  },
});