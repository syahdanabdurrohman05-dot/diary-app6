import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDiary } from '../../src/context/DiaryContext';
import { useDiarySearch } from '../../src/hooks/useDiarySearch';
import DiaryCard from '../../src/components/DiaryCard';
import { COLORS, SPACE, TYPO } from '../../src/styles/tokens';

const MOOD_FILTERS = ['😊', '🎯', '😌', '🥳'];

export default function HomeScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const {
    query,
    setQuery,
    selectedMood,
    setSelectedMood,
    resetFilter,
    filteredEntries,
    resultCount,
  } = useDiarySearch(entries);

  const searchRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const openDetail = useCallback(
    (id: number) => {
      router.push({
        pathname: '/detail/[id]',
        params: { id: String(id) },
      });
    },
    [router]
  );

  const handleReset = useCallback(() => {
    resetFilter();
    searchRef.current?.focus();
  }, [resetFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buku Harian</Text>

      {/* Bar Pencarian */}
      <View style={styles.searchRow}>
        <TextInput
          ref={searchRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Cari diary..."
          style={styles.search}
        />
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      {/* Filter Mood Chips */}
      <View style={styles.moodFilterRow}>
        <Pressable
          onPress={() => setSelectedMood(null)}
          style={[
            styles.moodChip,
            selectedMood === null && styles.moodChipActive,
          ]}
        >
          <Text
            style={[
              styles.moodChipText,
              selectedMood === null && styles.moodChipTextActive,
            ]}
          >
            Semua
          </Text>
        </Pressable>
        {MOOD_FILTERS.map((m) => (
          <Pressable
            key={m}
            onPress={() => setSelectedMood(selectedMood === m ? null : m)}
            style={[
              styles.moodChip,
              selectedMood === m && styles.moodChipActive,
            ]}
          >
            <Text style={styles.moodChipEmoji}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.counter}>{resultCount} entri ditemukan</Text>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={likedIds.has(item.id)}
            onPress={() => openDetail(item.id)}
            onToggleLike={() => toggleLike(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Diary tidak ditemukan.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACE.l,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACE.m,
  },
  searchRow: {
    flexDirection: 'row',
    gap: SPACE.s,
    marginBottom: SPACE.s,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  resetButton: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  resetText: {
    fontWeight: '600',
    color: COLORS.muted,
  },
  moodFilterRow: {
    flexDirection: 'row',
    gap: SPACE.s,
    marginVertical: SPACE.s,
    alignItems: 'center',
  },
  moodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
  },
  moodChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  moodChipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  moodChipTextActive: {
    color: '#fff',
  },
  moodChipEmoji: {
    fontSize: 16,
  },
  counter: {
    color: COLORS.muted,
    marginBottom: SPACE.s,
    fontSize: TYPO.caption,
  },
  list: {
    gap: SPACE.m,
    paddingBottom: SPACE.xl,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    paddingTop: 40,
  },
});