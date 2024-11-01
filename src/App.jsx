import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import Card from "./Components/Card.jsx";
import data from "./data.js";
import "./App.css";

function App() {
  // first ref will presist the map instance
  const mapRef = useRef();
  // second ref exposes the map container's element
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [13.405, 52.52],
      zoom: 9,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const displayData = data.map((item) => {
    return <Card key={item.id} {...item} />;
  });
  return (
    <>
      <div id="map-container" ref={mapContainerRef}></div>
      <section>{displayData}</section>
    </>
  );
}

export default App;
