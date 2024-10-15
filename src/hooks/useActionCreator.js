import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';

import * as ActionCreators from '../redux/actionCreators';

export const useActionCreator = () => {
  const dispatch = useDispatch();

  return React.useMemo(() => {
    return bindActionCreators(ActionCreators, dispatch);
  }, [dispatch]);
};
