import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.85; // El ancho del ítem central (85% del ancho de la pantalla)
const SPACING = (width - ITEM_WIDTH) / 2; // Espaciado para centrar el ítem

type CarouselItem = {
  titulo: string;
  imagen: string;
};

type CarouselProps = {
  items: CarouselItem[];
};

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Asegurar que el ítem activo esté centrado al inicio
    scrollViewRef.current?.scrollTo({
      x: activeIndex * ITEM_WIDTH,
      animated: true,
    });
  }, [activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    scrollViewRef.current?.scrollTo({ x: index * ITEM_WIDTH, animated: true });
    setActiveIndex(index);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    scrollViewRef.current?.scrollTo({ x: index * ITEM_WIDTH, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={
          Platform.OS === 'android' ? handleMomentumScrollEnd : undefined
        }
        scrollEventThrottle={16}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
      >
        {items.map((item, index) => (
          <View key={index} style={styles.carouselItemContainer}>
            <View style={styles.carouselItem}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.titulo}</Text>
              </View>
              <Image source={{ uri: item.imagen }} style={styles.image} />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              { opacity: index === activeIndex ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'absolute',
    bottom: 50,
  },
  carouselItemContainer: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
  },
  carouselItem: {
    width: ITEM_WIDTH - 10,
    borderRadius: 20,
    overflow: 'hidden',
    //backgroundColor: '#fff',
    // elevation: 3,
  },
  textContainer: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: ITEM_WIDTH - 10,
    height: 150,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
});

export default Carousel;
