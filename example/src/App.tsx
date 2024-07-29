import { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import MapLibrary, {
  Carousel,
  MapView,
  registerMarkerSelectListener,
} from 'react-native-map-library';

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

const dataDemo = [
  {
    id: '1',
    titulo: 'Descuento en Restaurante1',
    descripcion: 'Obtén un 20% de descuento en tu próxima visita.',
    imagen:
      'https://i.pinimg.com/originals/b0/ca/32/b0ca32465f36b9b135c021e5f25dc938.jpg',
    promocion: '20% de descuento',
    direccion: 'Av. Pardo y Aliaga 640, San Isidro, Lima',
    coordenadas: {
      latitud: -12.095431,
      longitud: -77.032194,
    },
  },
  {
    id: '2',
    titulo: 'Oferta en Tienda de Ropa1',
    descripcion: 'Compra 2 y lleva 3 en toda la tienda.',
    imagen:
      'https://i.pinimg.com/originals/b0/ca/32/b0ca32465f36b9b135c021e5f25dc938.jpg',
    promocion: 'Compra 2 y lleva 3',
    direccion: 'Av. Larco 812, Miraflores, Lima',
    coordenadas: {
      latitud: -12.122655,
      longitud: -77.029374,
    },
  },
  {
    id: '3',
    titulo: 'Spa y Relax1',
    descripcion: 'Disfruta de una sesión de masaje con el 50% de descuento.',
    imagen:
      'https://i.pinimg.com/originals/b0/ca/32/b0ca32465f36b9b135c021e5f25dc938.jpg',
    promocion: '50% de descuento',
    direccion: 'Calle Los Libertadores 390, San Isidro, Lima',
    coordenadas: {
      latitud: -12.101505,
      longitud: -77.036209,
    },
  },
  {
    id: '4',
    titulo: 'Entrada Gratis al Museo1',
    descripcion: 'Obtén una entrada gratis con cada compra de boleto.',
    imagen:
      'https://i.pinimg.com/originals/b0/ca/32/b0ca32465f36b9b135c021e5f25dc938.jpg',
    promocion: 'Entrada Gratis',
    direccion: 'Av. Javier Prado Este 2465, San Borja, Lima',
    coordenadas: {
      latitud: -12.091246,
      longitud: -77.004931,
    },
  },
];

export default function App() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  useEffect(() => {
    const unregisterListener = registerMarkerSelectListener((event) => {
      console.log('Marker seleccionado', event);
    });

    const fetchData = async () => {
      let response;
      try {
        if (Platform.OS === 'ios') {
          const responseData = await fetch(
            'https://demo1012858.mockable.io/benefits'
          );
          if (!responseData.ok) {
            throw new Error('Sucedio un error');
          }
          response = await responseData.json();
        } else {
          response = {
            data: dataDemo,
          };
        }
        setBeneficios(response.data);
        for (const benefit of response.data) {
          console.log('Agregando el beneficio', benefit);
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
