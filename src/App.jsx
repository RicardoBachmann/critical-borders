import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Card from "./Components/Card.jsx";
import data from "./data.js";
import "./App.css";

const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

function App() {
  const mapRef = useRef(); // First ref will presist the map instance
  const mapContainerRef = useRef(); // Second ref exposes the map container's element
  const markersRef = useRef([]); // New ref to manage markers
  const popupRef = useRef(null); // Single popup instance

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  // State to hold the zone data and the display mode (all zones or conflict zones only)
  const [displayConflictZones, setDisplayConflictZones] = useState(false);

  // Filter data based on displayConflictZones
  const filteredData = displayConflictZones
    ? data.filter((item) => item.isConflictZone)
    : data;

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
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

  // Effect to update markers and re-use a single popup
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = []; // Reset marker array

    // Add new markers
    filteredData.forEach((item) => {
      const marker = new mapboxgl.Marker({
        color: "red",
        draggable: true,
      })
        .setLngLat([item.coordinates.longitude, item.coordinates.latitude])
        .addTo(mapRef.current);

      const handleClick = () => {
        // Create a new popup instance for each click
        const popup = new mapboxgl.Popup({
          offset: [0, -40],
          closeOnClick: true,
          maxWidth: "200px",
        })
          .setLngLat(marker.getLngLat())
          .setHTML(`<p>${item.description}</p>`)
          .addTo(mapRef.current);

        // Close the popup when its no longer needed
        popup.on("close", () => popup.remove());
      };

      // Attach click listener to marker element
      marker.getElement().addEventListener("click", handleClick);

      // Store marker and its click handler for cleanup
      markersRef.current.push({ marker, handleClick });
    });
    // Cleanup on component unmount or data change
    return () => {
      markersRef.current.forEach(({ marker, handleClick }) => {
        marker.getElement().removeEventListener("click", handleClick);
        marker.remove();
      });
      markersRef.current = [];
      if (popupRef.current) popupRef.current.remove();
    };
  }, [filteredData]);

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
      <div id="map-container" ref={mapContainerRef}>
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
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
