package com.maplibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.Marker;

public class MapViewManager extends SimpleViewManager<MapView> {
  public static final String REACT_CLASS = "RCTMapView";
  private static GoogleMap googleMap;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected MapView createViewInstance(ThemedReactContext reactContext) {
    MapView mapView = new MapView(reactContext);
    mapView.onCreate(null);
    mapView.onResume();
    mapView.getMapAsync(new OnMapReadyCallback() {
      @Override
      public void onMapReady(GoogleMap map) {
        googleMap = map;
        map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
          @Override
          public boolean onMarkerClick(Marker marker) {
            WritableMap event = Arguments.createMap();
            event.putDouble("latitude", marker.getPosition().latitude);
            event.putDouble("longitude", marker.getPosition().longitude);
            event.putString("title", marker.getTitle() != null ? marker.getTitle() : "");
            event.putString("snippet", marker.getSnippet() != null ? marker.getSnippet() : "");
            MapLibraryModule.sendEvent("onMarkerSelect", event);
            return false;
          }
        });
      }
    });
    return mapView;
  }

  @ReactProp(name = "region")
  public void setRegion(MapView view, ReadableMap region) {
    // handle the region prop
  }

  public static GoogleMap getGoogleMap() {
    return googleMap;
  }
}
