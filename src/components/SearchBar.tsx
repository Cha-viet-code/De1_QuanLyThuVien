import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import colors from '../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>⌕</Text>

      <TextInput
        style={styles.input}
        placeholder="Tìm tên sách hoặc tác giả..."
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Tìm kiếm sách theo tên hoặc tác giả"
      />

      {value.length > 0 && (
        <Text
          onPress={() => onChangeText('')}
          style={styles.clear}
          accessibilityRole="button"
        >
          Xóa
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 25,
    color: colors.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 8,
  },
  clear: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    padding: 8,
  },
});