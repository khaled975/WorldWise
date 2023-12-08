import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useContext, useEffect, useState } from "react";
import { CitiesContext } from "../Contexts/CitiesContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
import { useGeolocation } from "../hooks/GeoLoaction";
import { useUrlLocation } from "../hooks/useUrlLocation";
function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const context = useContext(CitiesContext);
  const { cities } = context;
  // console.log(cities);

  // GET QUERY DATA FROM URL
  const [cityLat, cityLng] = useUrlLocation();
  // GET USER LOCATION
  const {
    isLoading,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  // console.log(geoLocationPosition);

  // UPDATE POSITION WHEN CLICK ON CURRENT CITIES
  useEffect(() => {
    if (cityLat && cityLng) setMapPosition([cityLat, cityLng]);
  }, [cityLat, cityLng]);

  // GET CURRENT USER POSITION
  useEffect(
    function () {
      if (geoLocationPosition) {
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      }
    },
    [geoLocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoading ? "Loading" : "use your Location"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeMapCenter position={mapPosition} />
        <HandelMapClick />
      </MapContainer>
    </div>
  );
}

function HandelMapClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      console.log(e);
      const { lat, lng } = e.latlng;
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
}

function ChangeMapCenter({ position }) {
  const map = useMap();
  map.setView(position);
  // console.log(map);
  return null;
}
export default Map;
