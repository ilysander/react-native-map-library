import { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import MapLibrary, {
  Carousel,
  MapView,
  registerMarkerSelectListener,
} from 'rn-map-carousel';

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface Beneficio {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  promocion: string;
  direccion: string;
  coordenadas: Coordenadas;
}

export default function App() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  useEffect(() => {
    const unregisterListener = registerMarkerSelectListener((event: any) => {
      console.log('Marker seleccionado', event);
    });

    const fetchData = async () => {
      let response;
      try {
        const responseData = await fetch(
          'https://demo1012858.mockable.io/benefits'
        );
        if (!responseData.ok) {
          throw new Error('Sucedio un error');
        }
        response = await responseData.json();
        setBeneficios(response.data);

        for (const benefit of response.data) {
          addMarker(benefit);
        }
      } catch (error) {
        console.error((error as { message: string }).message);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 1000);

    return () => {
      unregisterListener();
    };
  }, []);

  const addMarker = async (benefit: Beneficio) => {
    try {
      await MapLibrary.addMarker(
        benefit.coordenadas.latitud,
        benefit.coordenadas.longitud,
        benefit.titulo,
        benefit.id
      );
    } catch (error) {
      console.error('RN Error:', error);
    }
  };

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <MapView style={styles.map} />
        <Carousel items={beneficios} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
