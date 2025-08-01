"use client";

import "../utils/fixLeafletIcon";
import dynamic from "next/dynamic";
import { LatLngBounds, LatLngExpression } from "leaflet";
import { useMemo, useState } from "react";
import {
  IHandleBoundsChange,
  ITile,
  MapEventHandler,
} from "@/components/MapEventHandler";
import { tileXYToBounds } from "@/utils/tileXYtoBounds";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Rectangle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Rectangle),
  { ssr: false }
);

const center = [35.6895, 139.6917];

export default function HomePage() {
  const [mapTheme, setMapTheme] = useState("light_all");
  const [visibleBounds, setVisibleBounds] = useState<LatLngBounds | null>(null);
  const [tilesInView, setTilesInView] = useState<ITile[]>([]);

  const dummyMarkers = useMemo(() => {
    const markers = [];

    for (let i = 0; i < 20; i++) {
      markers.push({
        id: i,
        position: [
          center[0] + Math.random() * 0.1 - 0.05,
          center[1] + Math.random() * 0.1 - 0.05,
        ] as LatLngExpression,
      });
    }

    return markers;
  }, []);

  const toggleTheme = () => {
    if (mapTheme === "dark_all") setMapTheme("light_all");
    else setMapTheme("dark_all");
  };

  const handleBoundsChange = ({ bounds, tiles }: IHandleBoundsChange) => {
    setVisibleBounds(bounds);
    setTilesInView(tiles);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <button onClick={toggleTheme}>Dark/Light mode</button>
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%" }}
        minZoom={10}
        wheelDebounceTime={80}
        wheelPxPerZoomLevel={100}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${mapTheme}/{z}/{x}/{y}{r}.png`}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapEventHandler handleBoundsChange={handleBoundsChange} />
        {tilesInView.map(({ x, y, z }, idx) => {
          const bounds = tileXYToBounds(x, y, z) as [
            [number, number],
            [number, number]
          ];
          return (
            <Rectangle
              key={`${x}-${y}-${z}`}
              bounds={bounds}
              pathOptions={{
                color: "red",
                weight: 1,
                fillColor: "transparent",
              }}
            />
          );
        })}
        {dummyMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>Marker {marker.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
