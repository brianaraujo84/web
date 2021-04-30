const geocodeByPlaceId = (placeId) => {
  const geocoder = new global.google.maps.Geocoder();
  const { OK } = global.google.maps.GeocoderStatus;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        return reject(status);
      }
      return resolve(results);
    });
  });
};

export default geocodeByPlaceId;
