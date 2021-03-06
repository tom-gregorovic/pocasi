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
  const [cams, setCams] = useState();

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
    fetch("/api/cams")
    .then(resp => resp.json())
    .then(data => {
      setCams(data)
    });
  }, []);

  useEffect(() => {
    if (map && cams) {
      const coords = [[51.3, 11.7], [47.3, 23]];
      const coordsSnow = [[51.06, 12.05], [48.5, 18.9]];
      const coordsAladin = [[51.12, 11.99], [48.38, 19.08]];
      const lVisIr = L.imageOverlay("/api/clouds/vis-ir", coords, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ & EUMETSAT" });
      const l24h = L.imageOverlay("/api/clouds/24h", coords, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ & EUMETSAT" });
      const lAladin12 = L.imageOverlay("/api/clouds/aladin/12", coordsAladin, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ" });
      const lAladin15 = L.imageOverlay("/api/clouds/aladin/15", coordsAladin, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ" });
      const lSnow = L.imageOverlay("/api/snow", coordsSnow, { opacity: 0.8, attribution: "(c) 2007-2019 ČHMÚ" });
      const lCams = L.layerGroup();
      
      const sunrise = getSunrise(config.params.center[0], config.params.center[1]);
      const sunset = getSunset(config.params.center[0], config.params.center[1]);

      const time = new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
      const sunriseTime = (sunrise.getUTCHours() + 1) * 60 + sunrise.getUTCMinutes();
      const sunsetTime = (sunset.getUTCHours() - 1) * 60 + sunset.getUTCMinutes();

      map.addLayer((time >= sunriseTime && time <= sunsetTime) ? lVisIr : l24h);
      map.addLayer(lCams);

      L.control.layers(null, { 
        "oblačnost (vis-ir)": lVisIr, 
        "oblačnost (24h)": l24h, 
        "oblačnost Aladin (zítra 12 UTC)": lAladin12, 
        "oblačnost Aladin (zítra 15 UTC)": lAladin15, 
        "sníh": lSnow, 
        "kamery": lCams }).addTo(map);

      if (cams) {
        const markers = []; 
        cams.forEach(cam => {
          const m = markers.find(i => i.coords.slice(0, 2).join(",") == cam.coords.slice(0, 2).join(","));

          const popup = `<a href="${cam.page}" target="_blank">${cam.name} ${cam.dir} ${cam.coords[2]} m<br/><img src="/api/cams/${cam.id}"/></a>`;

          if (m) {
            m.popups.push(popup);
          } else {
            markers.push({ coords: cam.coords, popups: [popup]});
          }
        });

        markers.forEach(cam => {
          const marker = L.marker(cam.coords, { icon: L.divIcon({ html: "📷",  }) }).addTo(lCams);
          marker.bindPopup(cam.popups.join("<br/>"));
        });
      }
    }
  }, [map, cams]);

  return (
    <div id="map"/>
  );
}

export default Map;