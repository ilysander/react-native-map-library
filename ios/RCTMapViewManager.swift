import GoogleMaps
import React

@objc(RCTMapViewManager)
class RCTMapViewManager: RCTViewManager {
  override func view() -> UIView! {
    let mapView = GMSMapView(frame: .zero)
      mapView.isMyLocationEnabled = true
      // Ajustar el nivel de zoom
      let camera = GMSCameraPosition.camera(withLatitude: -12.095431, longitude: -77.032194, zoom: 13.0)
      mapView.camera = camera

    if let mapLibrary = self.bridge.module(for: MapLibrary.self) as? MapLibrary {
      mapLibrary.setMapView(mapView: mapView)
    }

    return mapView
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
