import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function MarkerLayer({
  map, // Pass the map instance as a prop
  latitude,
  longitude,
  onClick,
  isSelected,
}) {
  useEffect(() => {
    // Create a new DOM element for the custom marker
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.cursor = "pointer";

    // Customize the marker SVG
    el.innerHTML = `
      <svg
        width="116"
        height="116"
        viewBox="0 0 116 116"
        stroke-width="2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="transform: scale(0.6)"
      >
        <line
          x1="68.6066"
          y1="68.6066"
          x2="47.3934"
          y2="47.3934"
          stroke="${isSelected ? "red" : "#3AD713"}"
        />
        <line
          x1="68.6066"
          y1="47.3934"
          x2="47.3934"
          y2="68.6066"
          stroke="${isSelected ? "red" : "#3AD713"}"
        />
        <circle cx="58" cy="58" r="27.5" stroke="${
          isSelected ? "red" : "#3AD713"
        }" />
      </svg>
    `;

    // Add click handler
    el.onclick = onClick;

    // Create a new Mapbox Marker and add it to the map
    const marker = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Cleanup marker when component unmounts
    return () => marker.remove();
  }, [map, latitude, longitude, onClick, isSelected]);

  return null; // This component does not render anything directly
}
