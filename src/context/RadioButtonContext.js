/* eslint-disable prettier/prettier */
import React from 'react';

export const RadioButtonContext = React.createContext(null);

export const RadioButtonProvider = ({ children }) => {
  const [val, setVal] = React.useState(1);
  return (
    <RadioButtonContext.Provider
      value={{
        idx: val,
        changeIdx: newIdx => setVal(newIdx),
      }}>
      {children}
    </RadioButtonContext.Provider>
  );
};
