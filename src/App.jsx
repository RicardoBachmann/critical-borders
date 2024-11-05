import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Marker } from "react-map-gl";

import Card from "./Components/Card.jsx";
import data from "./data.js";
import "./App.css";

const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

function App() {
  // First ref will presist the map instance
  const mapRef = useRef();
  // Second ref exposes the map container's element
  const mapContainerRef = useRef();
  // To store and remove markers
  const markersRef = useRef([]);

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  // State to hold the zone data and the display mode (all zones or conflict zones only)
  const [displayConflictZones, setDisplayConflictZones] = useState(false);
  // Track selected marker
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Filter data based on displayConflictZones
  const filteredData = displayConflictZones
    ? data.filter((item) => item.isConflictZone)
    : data;

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    mapRef.current.on("move", () => {
      // Set an event listener that fires repeatedly during an animated transition
      // Get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  const flyToLocation = (coordinates) => {
    mapRef.current.flyTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: 10,
      essential: true,
    });
  };

  const selectConflictZones = () => setDisplayConflictZones(true);
  const selectAllZones = () => setDisplayConflictZones(false);
  return (
    <>
      <Map id="map-container" ref={mapContainerRef}>
        <section className="control-panel">
          <div className="sidebar">
            Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)}{" "}
            | Zoom: {zoom.toFixed(2)}
          </div>
          <button onClick={selectConflictZones}>Conflict Zones</button>
          <button onClick={selectAllZones}>All Zones</button>
          <button className="reset-button" onClick={handleButtonClick}>
            Reset
          </button>
          <div>
            {filteredData.map((item) => (
              <Card
                key={item.id}
                countries={item.countries}
                onClick={() => flyToLocation(item.coordinates)}
              />
            ))}
            <Marker
              longitude={9.993682}
              latitude={53.551086}
              anchor="bottom"
            ></Marker>
          </div>
        </section>
      </Map>
    </>
  );
}

export default App;
