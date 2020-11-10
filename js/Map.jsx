import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

const config = {
  params: {
    center: [49.20, 16.61],
    zoomControl: false,
    zoom: 8,
    minZoom: 8,
    scrollwheel: false,
    infoControl: false,
    attributionControl: false
  },
  tileLayer: {
    uri: 'https://tile.freemap.sk/X/{z}/{x}/{y}.jpeg',
    params: {
      minZoom: 8,
      maxZoom: 19,
      id: '',
      accessToken: ''
    }
  }
};

const Map = (props) => {

  const [map, setMap] = useState();

  const initMap = () => {
    const m = L.map("map", config.params);
    L.control
      .attribution({
        prefix:
          'Mapa © <a href="https://www.freemap.sk">Freemap</a> Slovakia, dáta © prispievatelia <a href="https://osm.org/copyright" target="_blank">OpenStreetMap</a>',
        position: 'bottomright'
      })
      .addTo(m);
    L.control
      .scale({
        position: 'bottomright',
        imperial: false
      })
      .addTo(m);
    L.control.zoom({ position: 'bottomright' }).addTo(m);

    const mapTiles = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(m);      
    
    setMap(m);
  };

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (map) {
      const coords = [[51.3, 11.7], [47.3, 23]];
      const lVisIr = L.imageOverlay("/api/vis-ir", coords, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ & EUMETSAT" });
      const l24h = L.imageOverlay("/api/24h", coords, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ & EUMETSAT" });

      const sunrise = getSunrise(config.params.center[0], config.params.center[1]);
      const sunset = getSunset(config.params.center[0], config.params.center[1]);

      const time = new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
      const sunriseTime = (sunrise.getUTCHours() + 1) * 60 + sunrise.getUTCMinutes();
      const sunsetTime = (sunset.getUTCHours() - 1) * 60 + sunset.getUTCMinutes();

      map.addLayer((time >= sunriseTime && time <= sunsetTime) ? lVisIr : l24h);

      L.control.layers(null, { "oblačnost (vis-ir)": lVisIr, "oblačnost (24h)": l24h }).addTo(map);
    }
  }, [map]);

  return (
    <div id="map"/>
  );
}

export default Map;