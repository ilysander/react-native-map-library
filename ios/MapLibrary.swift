import GoogleMaps
import React

@objc(MapLibrary)
class MapLibrary: RCTEventEmitter {

    private var mapView: GMSMapView?
    
    @objc(setMapView:)
    func setMapView(mapView: GMSMapView) {
        self.mapView = mapView
        self.mapView?.delegate = self
    }

    @objc(addMarker:longitude:title:snippet:resolve:reject:)
    func addMarker(latitude: Double, longitude: Double, title: String, snippet: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      DispatchQueue.main.async {
        guard let mapView = self.mapView else {
          reject("add_marker_error", "GoogleMap no esta listo", nil)
          return
        }
        // Ajustar el nivel de zoom
        let camera = GMSCameraPosition.camera(withLatitude: latitude, longitude: longitude, zoom: 13.0)
        mapView.camera = camera
        let marker = GMSMarker()
        marker.position = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        marker.title = title
        marker.snippet = snippet
        marker.map = mapView
        resolve("Marker agregado")
      }
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
      }

    override func supportedEvents() -> [String]! {
        return ["onMarkerSelect"]
      }

    func sendMarkerSelectEvent(marker: GMSMarker) {
      sendEvent(withName: "onMarkerSelect", body: [
        "latitude": marker.position.latitude,
        "longitude": marker.position.longitude,
        "title": marker.title ?? "",
        "snippet": marker.snippet ?? ""
      ])
    }
}
extension MapLibrary: GMSMapViewDelegate {
  func mapView(_ mapView: GMSMapView, didTap marker: GMSMarker) -> Bool {
    sendMarkerSelectEvent(marker: marker)
    return true
  }
}
