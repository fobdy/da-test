import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import styled from 'styled-components';
import { multiExtent, transpose } from './helpers';
// import { interpolateViridis as interpolator } from 'd3-scale-chromatic';
import humanFormat from 'human-format';
import './NetworkMap.less';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default class NetworkMap extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  propTypes = {
    setDidMountListener: PropTypes.func.isRequired,
    points: PropTypes.array
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });

    this.map = L.map(this.mapContainer, {
      minZoom: 2,
      maxZoom: 15,
      layers: [tiles]
    });

    this.props.setDidMountListener(() => {
      this.map.invalidateSize();
    });
  }

  componentWillReceiveProps(newProps) {
    if (Array.isArray(newProps.points) && newProps.points.length > 0) {
      this.heatLayer = this._createHeatMapLayer(newProps.points);
      this.clusterLayer = this._createClusterLayer(newProps.points);
      this._setLayerControls(this.heatLayer, this.clusterLayer);
      this._fitMap(newProps.points);
    }
  }

  _createHeatMapLayer(points) {
    const maxHits = points.reduce((max, [,hits,]) => Math.max(hits, max), 0);

    const heatData = points.map(([, hits, geo]) => {
      const { latitude, longitude } = geo.location;
      return [latitude, longitude, hits];
    });

    const heatLeayer = L.heatLayer(heatData, {
      radius: 15,
      // blur: 50,
      minOpacity: 0.7,
      max: maxHits,
      // gradient: generateColorStops(interpolator, 4)
    });

    return heatLeayer;
  }

  _createClusterLayer(points) {
    const fmt = (v) => {
      return humanFormat(v, {
        separator: '',
        decimals: 1
      });
    };

    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      singleMarkerMode: true,
      iconCreateFunction: cluster => {
        const totalHits = cluster.getAllChildMarkers()
          .map(({options}) => options.hits)
          .reduce((a, b) => a + b, 0);

        let c = ' marker-cluster-';
        if (totalHits < 500)
          c += 'small';
        else if (totalHits < 1000)
          c += 'medium';
        else
          c += 'large';

        return new L.DivIcon({
          html: `<div><span>${fmt(totalHits)}</span></div>`,
          className: `marker-cluster${c}`,
          iconSize: new L.Point(40, 40)
        });
      }
    });

    // const maxHits = points.reduce((max, [,hits,]) => Math.max(hits, max), 0);
    // const minHits = points.reduce((min, [,hits,]) => Math.min(hits, min), Infinity);

    // const normalize = v => (v - minHits) / (maxHits - minHits);
    //
    const generateTexts = (ip, geo) => {
      let first = '', second = '', third = '';
      const names = geo.humanNames;
      if (geo.city) {
        first = geo.city;
        if (names.country)
          second = names.country;
        if (names.subdivision && names.subdivision != geo.city)
          second = `${names.subdivision}, ${second}`;
      }
      else {
        first = names.country || geo.country;
      }
      third = ip;
      return {first, second, third};
    };

    points.forEach(([ip, hits, geo]) => {
      const { latitude, longitude } = geo.location;
      const { first, second, third } = generateTexts(ip, geo);

      markers.addLayer(L.marker([latitude, longitude], {
        stroke: false,
        fillColor: '#FA003A',
        // fillOpacity: Math.max(normalize(hits), 0.25),
        fillOpacity: 0.7,
        // radius: parseInt(Math.max(normalize(hits) * 15, 7), 10),
        radius: 10,
        ip,
        hits,
        geo
        // radius: 10
        // radius: accuracy_radius != null ? accuracy_radius : 25
      }).bindPopup(
        `<div class="title">${first}</div>` +
        `<div class="subtitle">${second}</div>` +
        `<div class="ip">${third}</div>`,
        { offset: [0, -13], closeButton: false }
      ));

    });

    return markers;
  }

  _setLayerControls(heatLayer, clusterLayer) {
    this.map.addLayer(clusterLayer);
    L.control.layers({
      'Heatmap': heatLayer,
      'Clusters': clusterLayer
    }, null, { collapsed: false, sortLayers: true }).addTo(this.map);
  }

  _fitMap(points) {
    const bounds = multiExtent(points, ([,,{ location }]) => [
      location.latitude,
      location.longitude
    ]);
    const corners = transpose(bounds);
    this.map.fitBounds(corners);
    // this.map.setMaxBounds(corners);
  }



  render() {
    // const position = [this.state.lat, this.state.lng]
    return (
      <MapContainer innerRef={x => this.mapContainer = x} />
    );
  }
}
