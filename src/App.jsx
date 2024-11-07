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

    // Close popup when clicking on the map
    mapRef.current.on("click", () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
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
        className: "marker",
        draggable: false,
      })
        .setLngLat([item.coordinates.longitude, item.coordinates.latitude])
        .addTo(mapRef.current);

      // Handle marker click to display popup
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent map click event from firing

        // Close any open popup
        if (popupRef.current) {
          popupRef.current.remove();
        }
        // Add custom HTML
        const popupContent = `
          <div class="custom-popup">
            <h3>${item.countries.join(" & ")}</h3>
            <p>${item.issues}</p>
              <br/>
            <p>${item.description}</p>
          </div>
        `;

        // Create a new popup
        popupRef.current = new mapboxgl.Popup({
          className: "marker-popup",
          offset: [0, -40],
          closeOnClick: true,
          maxWidth: "200px",
        })
          .setLngLat(marker.getLngLat())
          .setHTML(popupContent)
          .addTo(mapRef.current);
      });

      markersRef.current.push({ marker });
    });
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
