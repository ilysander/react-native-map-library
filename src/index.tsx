import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  requireNativeComponent,
  type ViewStyle,
} from 'react-native';
import Carousel from './Carousel';
const LINKING_ERROR =
  `The package 'rn-map-carousel' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MapLibrary = NativeModules.MapLibrary
  ? NativeModules.MapLibrary
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const RCTMapView = requireNativeComponent('RCTMapView');

type MapLibraryType = {
  addMarker: (
    latitude: number,
    longitude: number,
    title: string,
    snippet: string
  ) => Promise<string>;
};

const mapLibrary: MapLibraryType = {
  addMarker: (latitude, longitude, title, snippet) => {
    return MapLibrary.addMarker(latitude, longitude, title, snippet);
  },
};

type MapViewProps = {
  style?: ViewStyle;
};

export const MapView = (props: MapViewProps) => <RCTMapView {...props} />;
export function registerMarkerSelectListener(callback: (event: any) => void) {
  const eventEmitter = new NativeEventEmitter(MapLibrary);
  const eventListener = eventEmitter.addListener('onMarkerSelect', callback);

  return () => {
    eventListener.remove();
  };
}
export { Carousel };
export default mapLibrary;
