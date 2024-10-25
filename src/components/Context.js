import React from 'react';

const context = React.createContext();

export const AppGlobalProvider = ({ children }) => {
  const [val, setVal] = React.useState({});
  const [isAuth, setIsAuth] = React.useState(null);
  return (
    <context.Provider
      value={{
        appGlobal: val,
        setAppGlobal: setVal,
        isAuth,
        setIsAuth,
      }}>
      {children}
    </context.Provider>
  );
};

export const useAppGlobal = () => {
  return React.useContext(context);
};
