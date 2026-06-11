import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEditContext } from "../../AdminContext/AdminContext";

function LocationMarker() {
  const [position, setPosition] = useState<any>(null);
  const { setmaplatlongFunc } = useEditContext();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      console.log("Latitude:", lat);
      console.log("Longitude:", lng);

      setmaplatlongFunc(lat, lng);
      setPosition([lat, lng]);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function MapComponent() {
  return (
    <MapContainer
      center={[28.4595, 77.0266]}
      zoom={13}
      style={{ minHeight: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
