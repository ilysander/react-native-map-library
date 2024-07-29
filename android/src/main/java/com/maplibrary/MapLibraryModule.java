package com.maplibrary;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

@ReactModule(name = MapLibraryModule.NAME)
public class MapLibraryModule extends ReactContextBaseJavaModule {
  public static final String NAME = "MapLibrary";
  private static ReactApplicationContext reactContext;

  public MapLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    MapLibraryModule.reactContext = reactContext;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  public static void sendEvent(String eventName, WritableMap event) {
//    if (reactContext.hasActiveReactInstance()) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, event);
//    }
  }

  @ReactMethod
  public void addMarker(double latitude, double longitude, String title, String snippet, Promise promise) {
    GoogleMap googleMap = MapViewManager.getGoogleMap();
    if (googleMap == null) {
      promise.reject("add_marker_error", "GoogleMap no esta listo");
      return;
    }
    reactContext.runOnUiQueueThread(new Runnable() {
      @Override
      public void run() {
        LatLng location = new LatLng(latitude, longitude);
        Marker marker = googleMap.addMarker(new MarkerOptions()
          .position(new LatLng(latitude, longitude))
          .title(title)
          .snippet(snippet));
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 13));
        promise.resolve(marker.getId());
      }
    });
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Keep: Required Emitter calls.
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Keep: Required Emitter calls
  }
}
