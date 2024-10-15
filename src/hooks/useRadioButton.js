/* eslint-disable prettier/prettier */
import React from 'react';
import { RadioButtonContext } from '../context/RadioButtonContext';

export const useRadioButton = () => {
  const context = React.useContext(RadioButtonContext);
  if (!context) {
    throw new Error('wrap Provider around radio group');
  }
  return context;
};
