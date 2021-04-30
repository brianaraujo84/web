const locationTypes = {
  HOME: 'Home',
  BUSINESS: 'Business',
  OFFICE: 'Office',
  SCHOOL: 'School',
  HOTEL: 'Hotel',
  AIRBNB: 'Airbnb',
  RIDESHARE: 'Rideshare',
  GOVERNMENT: 'Government',
  CONSTRUCTION: 'Construction',
  GENERAL: 'General',
  STATE_STUDENT_HOUSING: 'Student Housing',
};

const locationImageURLs = {
  [locationTypes.HOME]: '/assets/img/floorplan-home.png',
  [locationTypes.BUSINESS]: '/assets/img/floorplan-business.png',
  [locationTypes.OFFICE]: '/assets/img/floorplan-office.png',
  [locationTypes.SCHOOL]: '/assets/img/floorplan-school.png',
  [locationTypes.HOTEL]: '/assets/img/floorplan-hotel.png',
  [locationTypes.AIRBNB]: '/assets/img/floorplan-home.png',
  [locationTypes.GOVERNMENT]: '/assets/img/floorplan-business.png',
  [locationTypes.CONSTRUCTION]: '/assets/img/floorplan-business.png',
};

export {
  locationTypes,
  locationImageURLs
};
