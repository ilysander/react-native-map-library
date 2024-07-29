# rn-map-carousel

Una librería de React Native para mostrar e interactuar con mapas ,marcadores y un carrousel.

## Instalación

### Usando npm
    
    npm install rn-map-carousel


### Usando yarn
    
    npm install rn-map-carousel

## Configuración de Google Maps

### Android

Agrega tu clave de API de Google Maps en tu archivo AndroidManifest.xml:

<xml>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourpackage">

    <application
        android:networkSecurityConfig="@xml/network_security_config"
        android:usesCleartextTraffic="true">
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="TU_CLAVE_DE_API_DE_GOOGLE_MAPS" />
        ...
    </application>
</manifest>
</xml>

### iOS

<code>
    #import <GoogleMaps/GoogleMaps.h>

    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
        [GMSServices provideAPIKey:@"TU_CLAVE_DE_API_DE_GOOGLE_MAPS"];
        ...
        return YES;
    }
    @end
</code>

## Uso

Aquí tienes un ejemplo de cómo usar la biblioteca del mapa con un componente de carrusel (tambien tiene una carpeta de example con el uso):

<code>
    import { useState, useEffect, useRef } from 'react';
    import { StyleSheet, View, SafeAreaView } from 'react-native';
    import MapLibrary, { Carousel, MapView, registerMarkerSelectListener } from 'rn-map-carousel';

    interface Coordenadas {
    latitud: number;
    longitud: number;
    }

    interface Beneficio {
    id:string;
    titulo: string;
    descripcion: string;
    imagen: string;
    promocion: string;
    direccion: string;
    coordenadas: Coordenadas;
    }

    export default function App() {
    const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const carouselRef = useRef<any>(null);

    useEffect(() => {
        const unregisterListener = registerMarkerSelectListener((event) => {
        console.log('Marker seleccionado', event);
        
        });
        
        const fetchData = async () => {
        try {
            const responseData = await fetch('https://demo1012858.mockable.io/benefits');
            if (!responseData.ok) {
            throw new Error('Sucedio un error');
            }
            const response = await responseData.json();
            setBeneficios(response.data);
            for (const benefit of response.data) {
                console.log('Agregando el beneficio', benefit)
                addMarker(benefit)
            }

        } catch (error) {
            setError((error as {message:string}).message);
        } finally {
            setLoading(false);
        }
        };
        fetchData();

        return () => {
        unregisterListener();
        }
    }, []);

    const addMarker = async(benefit:Beneficio) => {
        try {
        const res = await MapLibrary.addMarker(
                                benefit.coordenadas.latitud, 
                                benefit.coordenadas.longitud, 
                                benefit.titulo, 
                                benefit.id);
                                
        } catch (error) {
        console.error('RN Error:',error)
        }
    }

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
    bg:{
        flex:1,
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
        height:'100%',
        width:'100%'
    },
    });
</code>


## Componentes

### MapView

El componente MapView muestra el mapa y permite la interacción con él.

#### Propiedades

style (opcional): El estilo a aplicar a la vista del mapa.

### Carousel

El componente Carousel muestra un carrusel horizontal de elementos.

#### Propiedades

items (requerido): Un array de elementos a mostrar en el carrusel. Cada elemento debe tener una propiedad titulo y imagen.

### Licencia

MIT