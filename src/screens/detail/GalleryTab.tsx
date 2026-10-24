import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {Breed} from '../../types/dog';
import {colors, spacing} from '../../theme';

type Props = {
  breed: Breed;
};

const WIDTH = Dimensions.get('window').width;

export function GalleryTab({breed}: Props): React.JSX.Element {
  const images = breed.attributes.images;
  const [index, setIndex] = useState(0);
  const scrolling = useRef(false);

  if (images.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  const current = images[index];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          scrolling.current = true;
        }}
        onMomentumScrollEnd={event => {
          const next = Math.round(event.nativeEvent.contentOffset.x / WIDTH);
          setIndex(next);
          scrolling.current = false;
        }}
        scrollEventThrottle={16}>
        {images.map(image => (
          <Image
            key={image.id}
            source={{uri: image.medium || image.url}}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <Text style={styles.counter}>
        {index + 1} / {images.length}
      </Text>
      <View style={styles.attr}>
        <Text style={styles.attrTitle}>Attribution</Text>
        <Text style={styles.attrText}>
          Author: {current.attribution.author ?? 'Unknown'}
        </Text>
        <Text style={styles.attrText}>
          License: {current.attribution.license ?? 'Unknown'}
        </Text>
        <Text style={styles.attrText}>
          Source: {current.attribution.source ?? 'Unknown'}
        </Text>
        {current.attribution.source_url != null ? (
          <Pressable
            onPress={() => {
              void Linking.openURL(current.attribution.source_url!);
            }}>
            <Text style={styles.link}>View source</Text>
          </Pressable>
        ) : null}
        {current.attribution.license_url != null ? (
          <Pressable
            onPress={() => {
              void Linking.openURL(current.attribution.license_url!);
            }}>
            <Text style={styles.link}>License details</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  image: {
    width: WIDTH,
    height: WIDTH * 0.75,
    backgroundColor: colors.chip,
  },
  counter: {
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.muted,
    fontWeight: '600',
  },
  attr: {
    padding: spacing.lg,
  },
  attrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  attrText: {
    color: colors.muted,
    marginBottom: 4,
  },
  link: {
    color: colors.accent,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {color: colors.muted},
});
