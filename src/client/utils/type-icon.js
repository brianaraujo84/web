export default (type) => {
  switch (type) {
    case 'General':
      return 'fa-users';
    case 'Hotel':
      return 'fa-hotel';
    case 'School':
      return 'fa-school';
    case 'Rideshare':
      return 'fa-car';
    case 'Office':
      return 'fa-building';
    case 'Business':
      return 'fa-store';
    case 'Government':
      return 'fa-university';
    case 'Construction':
      return 'fa-construction';
    case 'Home':
    case 'Airbnb':
    default:
      return 'fa-home-lg';
  }
};
