export function multiExtent(heatData, getter=(a => a)) {
  return heatData.reduce((bounds, item) => {
    const [lat, lng] = getter(item);
    const [latBounds, lngBounds] = bounds;
    const minLat = Math.min(lat, latBounds[0]);
    const maxLat = Math.max(lat, latBounds[1]);
    const minLng = Math.min(lng, lngBounds[0]);
    const maxLng = Math.max(lng, lngBounds[1]);
    return [
      [minLat, maxLat],
      [minLng, maxLng],
    ];
  }, [[0, 0], [0, 0]]);
}

export function transpose([lats, lngs]) {
  return [
    [lats[0], lngs[0]],
    [lats[1], lngs[1]]
  ];
}

export function generateColorStops(interpolator, intervals=3) {
  const stops = Object.create(null);
  let stop = 1;
  const delta = 1 / intervals;
  while (stop > 0) {
    stops[Number(stop.toFixed(2))] = interpolator(stop);
    stop -= delta;
  }
  stops[0] = interpolator(stop);
  return stops;
}
