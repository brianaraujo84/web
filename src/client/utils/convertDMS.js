const toDegreesMinutesAndSeconds = (coordinate) => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

  return degrees + '°' + minutes + '\'' + seconds;
};

export const convertDMS = (lat, lng) => {
  const latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = toDegreesMinutesAndSeconds(lng);
  const longitudeCardinal = lng >= 0 ? 'E' : 'W';

  return latitude + '"' + latitudeCardinal + ' ' + longitude + '"' + longitudeCardinal;
};
