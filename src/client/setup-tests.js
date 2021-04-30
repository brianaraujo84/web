const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');

global.GLOBAL_VARIABLES = {
  logo: '',
};

global.google = {
  maps: {
    Geocoder: jest.fn().mockReturnValue({
      geocode: jest.fn(),
    }),
    GeocoderStatus: {
      OK: 1,
    },
    LatLngBounds: jest.fn(),
    LatLng: jest.fn(),
    places: {
      AutocompleteService: jest.fn(),
    },
  }
};

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
jest.useFakeTimers();
global.URL.createObjectURL = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
  Trans: ({ children }) => children
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useLocation: () => ({
  }),
  useParams: () => ({
  }),
  Link: () => { },
  matchPath: () => { },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn()
}));

jest.mock('react', () => ({
  ...(jest.requireActual('react')),
}));

jest.mock('react-form-dynamic', () => ({
  ...(jest.requireActual('react-form-dynamic')),
}));

jest.mock('react-sortable-hoc', () => ({
  ...(jest.requireActual('react-sortable-hoc')),
}));

jest.mock('react-bootstrap', () => ({
  ...(jest.requireActual('react-bootstrap')),
}));

jest.mock('./i18n', () => ({
  t: text => text,
}));

jest.mock('./hooks', () => ({
  ...(jest.requireActual('./hooks')),
  useActionDispatch: () => jest.fn().mockResolvedValue({}),
  useTitle: () => jest.fn(),
}));

jest.mock('./utils', () => ({
  ...(jest.requireActual('./utils')),
}));

global.HTMLCanvasElement.prototype.getContext = () => {
  return {
    drawImage: jest.fn(),
  };
};
global.HTMLCanvasElement.prototype.toBlob = () => {
  return jest.fn().mockResolvedValue({});
};
