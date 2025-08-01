"use client";

import { latLngToTileXY } from "@/utils/latLngToTileXY";
import { LatLngBounds } from "leaflet";
import { FC, useEffect } from "react";
import { useMap } from "react-leaflet";

export interface ITile {
  x: number;
  y: number;
  z: number;
}

export interface IHandleBoundsChange {
  bounds: LatLngBounds;
  tiles: ITile[];
}

interface IMapEventHandler {
  handleBoundsChange: (functionParams: IHandleBoundsChange) => void;
}

export const MapEventHandler: FC<IMapEventHandler> = ({
  handleBoundsChange,
}) => {
  const map = useMap();

  useEffect(() => {
    const handleMove = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      //   console.log(bounds);
      //   console.log(zoom);

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const tileSW = latLngToTileXY(sw.lat, sw.lng, zoom);
      const tileNE = latLngToTileXY(ne.lat, ne.lng, zoom);

      const tiles: ITile[] = [];

      for (let x = tileSW.x; x <= tileNE.x; x++) {
        for (let y = tileNE.y; y <= tileSW.y; y++) {
          tiles.push({ x, y, z: zoom });
        }
      }

      console.log(tiles);

      handleBoundsChange({ bounds, tiles });
    };

    map.on("moveend", handleMove);
    map.on("zoomend", handleMove);

    handleMove();

    return () => {
      map.off("moveend", handleMove);
      map.off("zoomend", handleMove);
    };
  }, [map]);

  return null;
};
