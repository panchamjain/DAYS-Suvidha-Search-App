import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import { searchSuggestions } from '../data/mockData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectSuggestion: (type: string, id: string) => void;
}

interface Suggestion {
  type: string;
  text: string;
  id?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSelectSuggestion }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  
  const screenHeight = Dimensions.get('window').height;
  const maxSuggestionsHeight = screenHeight * 0.4; // 40% of screen height
  
  useEffect(() => {
    if (query.length > 0) {
      const results = searchSuggestions(query);
      setSuggestions(results);
      
      // Animate suggestions container height
      Animated.timing(animatedHeight, {
        toValue: Math.min(results.length * 50, maxSuggestionsHeight),
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setSuggestions([]);
      
      // Animate suggestions container height to 0
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [query]);
  
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      Keyboard.dismiss();
      setIsFocused(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    if (suggestion.id) {
      onSelectSuggestion(suggestion.type, suggestion.id);
      setQuery('');
      setSuggestions([]);
      Keyboard.dismiss();
      setIsFocused(false);
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };
  
  const renderSuggestionItem = ({ item }: { item: Suggestion }) => (
    <TouchableOpacity 
      style={styles.suggestionItem} 
      onPress={() => handleSelectSuggestion(item)}
    >
      <MaterialCommunityIcons 
        name={
          item.type === 'category' ? 'shape-outline' :
          item.type === 'merchant' ? 'store' :
          item.type === 'location' ? 'map-marker' : 'tag-outline'
        } 
        size={20} 
        color={COLORS.primary} 
      />
      <Text style={styles.suggestionText}>{item.text}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <MaterialCommunityIcons name="magnify" size={24} color={COLORS.primary} />
        <TextInput
          // @ts-ignore
          ref={inputRef}
          style={styles.input}
          placeholder="Search categories, merchants, locations..."
          placeholderTextColor={COLORS.text.tertiary}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow for suggestion selection
            setTimeout(() => setIsFocused(false), 200);
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      {isFocused && (
        <Animated.View style={[styles.suggestionsContainer, { height: animatedHeight }]}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `suggestion-${index}`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
    height: 56,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    ...SHADOWS.medium,
  },
  input: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginLeft: SIZES.base,
    paddingVertical: SIZES.base,
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginLeft: SIZES.base,
    height: 40,
    justifyContent: 'center',
  },
  searchButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginTop: -SIZES.base,
    overflow: 'hidden',
    ...SHADOWS.medium,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding - 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  suggestionText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginLeft: SIZES.base,
    flex: 1,
  },
});

export default SearchBar;
