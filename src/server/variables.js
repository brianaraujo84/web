const google_api_key = process.env.GOOGLE_API_KEY || 'AIzaSyBCO1yyBpUeUt4iwEDrf6vKBUBcE5DHS0E';
const ga_tracking_id = process.env.GA_TRACKING_ID || 'G-ZBTRJ8HY6';
const ga_ua_tracking_id = process.env.GA_UA_TRACKING_ID || 'UA-189524816-1';
const logo = '/assets/img/logo-white-wordmark-2.png';
const google_static_maps_api_key = process.env.GOOGLE_STATIC_MAPS_API_KEY || 'AIzaSyAikOgT-0Gs4vQ67Ps5YuRRr0v_rJsCKfs';

module.exports = {
  logo,
  google_api_key,
  ga_tracking_id,
  ga_ua_tracking_id,
  google_static_maps_api_key
};
