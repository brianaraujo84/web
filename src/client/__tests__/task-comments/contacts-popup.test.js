import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import ContactsPopup from '../../components/pages/task-comments/contacts-popup';

describe('ContactsPopup', () => {
  let props, state;

  beforeEach(() => {
    props = {
      task: {
        taskId: '23342'
      },
      contacts: [
        {
          'contactId': 13,
          'firstName': 'Test',
          'lastName': 'Owner',
          'userName': 'test.owner$r5labs.com',
          'email': 'test.owner@r5labs.com',
          'mobilePhone': '+19999999999',
          'contactType': 'Owner',
          'contactTypeLabel': 'Owner'
        },
        {
          'contactId': 453,
          'firstName': 'Test',
          'lastName': 'Manager',
          'userName': 'Test.manager$r5labs.com',
          'email': 'Test.manager@r5labs.com',
          'mobilePhone': '+17777777777'
        },
        {
          'contactId': 10,
          'firstName': 'Testing',
          'lastName': 'Member',
          'userName': 'test.member$r5labs.com',
          'email': 'test.member@r5labs.com',
          'mobilePhone': '+18888888888'
        }
      ],
      initialLoading: false,
    };

    state = {
      taskCommentList: {
        items: [
          { commentId: 1 },
        ],
      },
      files: {
        list: {
          adhoc: {
            taskId: '42'
          }
        }
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ContactsPopup {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
