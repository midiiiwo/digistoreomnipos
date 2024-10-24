import { Api, productApi } from '../api/axiosInstance';
import React from 'react';

export const useAxiosErrorResponseInterceptor = sessionStatus => {
  const [error, setError] = React.useState();
  const resInterceptor = React.useRef();
  const productApiInterceptor = React.useRef();
  React.useEffect(() => {
    resInterceptor.current = Api.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error_) {
        if (
          error_ &&
          typeof error_ === 'object' &&
          error_.hasOwnProperty('response')
        ) {
          console.log('erorr', error_);
          setError(error_);
        }
        return Promise.reject(error_);
      },
    );
    productApiInterceptor.current = productApi.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error_) {
        if (
          error_ &&
          typeof error_ === 'object' &&
          error_.hasOwnProperty('response')
        ) {
          setError(error_);
        }
        return Promise.reject(error_);
      },
    );
    return () => {
      Api.interceptors.response.eject(resInterceptor.current);
      productApi.interceptors.response.eject(productApiInterceptor.current);
    };
  }, [sessionStatus]);

  const ejectInterceptor = React.useCallback(() => {
    console.log('error ejected!!!!');
    Api.interceptors.response.eject(resInterceptor.current);
    productApi.interceptors.response.eject(productApiInterceptor.current);
    setError(null);
  }, []);

  return { error, ejectInterceptor };
};
