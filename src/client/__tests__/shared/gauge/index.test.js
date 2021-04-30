import React from 'react';
import { shallow } from 'enzyme';

import Gauge from '../../../components/shared/gauge';

jest.mock('gaugeJS', () => ({
  Donut: () => ({
    setOptions: jest.fn(),
    set: jest.fn(),
  }),
  useDispatch: () => jest.fn()
}));


describe('Gauge', () => {
  let props;

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: {} });

    props = {
      rotate: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('renders correctly', () => {
    const wrapper = shallow(<Gauge {...props} />);
    expect(wrapper.length).toBe(1);
  });
});

