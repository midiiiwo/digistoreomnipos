import { Api } from '../api/axiosInstance';
import React from 'react';
import moment from 'moment';
import RNSimpleCrypto from 'react-native-simple-crypto';
import { retrievePersistedData } from '../utils/asyncStorage';
import { productApi } from '../api/axiosInstance';
// import AsyncStorage from '@react-native-async-storage/async-storage';
const appId = 'IPAYMOBILEPOS';
const appKey = 'F73ldggm8KZP35N48t3OVbTaoOpaOlLy';

export async function appSecret(timeStamp) {
  const message = appId + ':' + timeStamp;
  const messageArrayBuffer =
    RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(message);
  const keyArrayBuffer = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(appKey);
  const signatureArrayBuffer = await RNSimpleCrypto.HMAC.hmac256(
    messageArrayBuffer,
    keyArrayBuffer,
  );
  const signatureHex =
    RNSimpleCrypto.utils.convertArrayBufferToHex(signatureArrayBuffer);
  return signatureHex;
}

export const useInitInterceptor = ({ sessionStatus }) => {
  const reqInterceptor = React.useRef();
  const productReqInterceptor = React.useRef();
  React.useEffect(() => {
    reqInterceptor.current = Api.interceptors.request.use(
      async request => {
        let timestamp = moment().format('x');
        const secret = await appSecret(timestamp);
        const user = await retrievePersistedData('user');

        //@ts-ignore
        request.headers = {
          ...request.headers,
          Authentication: secret,
          Time: timestamp,
          Application: appId,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Sid: user.sid,
        };

        const formBody = [];

        for (let i in request.data) {
          const key = encodeURIComponent(i);
          const value = encodeURIComponent(request.data[i]);

          formBody.push(key + '=' + value);
        }
        request.data = formBody.join('&');
        return request;
      },
      error => {
        Promise.reject(error);
      },
    );
    productReqInterceptor.current = productApi.interceptors.request.use(
      async request => {
        let timestamp = moment().format('x');
        const secret = await appSecret(timestamp);
        const user = await retrievePersistedData('user');
        request.headers = {
          ...request.headers,
          Authentication: secret,
          Time: timestamp,
          Application: appId,
          Accept: 'application/json',
          'Content-Type': 'application/form-data',
          Sid: user.sid,
        };
        const formBody = new FormData();
        for (let i in request.data) {
          formBody.append(i, request.data[i]);
        }
        request.data = formBody;

        return request;
      },
      error => {
        Promise.reject(error);
      },
    );
    return () => {
      Api.interceptors.request.eject(reqInterceptor.current);
      productApi.interceptors.request.eject(productReqInterceptor.current);
    };
  }, [sessionStatus]);

  const ejectReqInterceptor = React.useCallback(() => {
    Api.interceptors.request.eject(reqInterceptor.current);
    productApi.interceptors.request.eject(productReqInterceptor.current);
  }, []);

  return { ejectReqInterceptor };
};
