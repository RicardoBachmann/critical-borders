import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import Card from "./Components/Card.jsx";
import data from "./data.js";
import "./App.css";

const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

function App() {
  // first ref will presist the map instance
  const mapRef = useRef();
  // second ref exposes the map container's element
  const mapContainerRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);

  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,

      center: center,
      zoom: zoom,
    });

    mapRef.current.on("move", () => {
      // set an event listener that fires repeatedly during an animated transition
      // get the current center coordinates and zoom level from the map
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

  const displayData = data.map((item) => {
    return <Card key={item.id} {...item} />;
  });
  return (
    <>
      <div id="map-container" ref={mapContainerRef}>
        <section className="control-panel">
          <div className="sidebar">
            Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)}{" "}
            | Zoom: {zoom.toFixed(2)}
          </div>
          <button className="reset-button" onClick={handleButtonClick}>
            Reset
          </button>
          <div>{displayData}</div>
        </section>
      </div>
    </>
  );
}

export default App;
