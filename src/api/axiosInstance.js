/* eslint-disable prettier/prettier */
import axios from 'axios';
import moment from 'moment/moment';
import RNSimpleCrypto from 'react-native-simple-crypto';
import { retrievePersistedData } from '../utils/asyncStorage';
import { store } from '../redux/store';
const appId = 'IPAYMOBILEPOS';
const appKey = 'F73ldggm8KZP35N48t3OVbTaoOpaOlLy';

const DELIVERY_USER_ID = '88c34fdd-de3f-43f6-89e4-a19c97070d21';
const DELIVERY_API_TOKEN =
  'W1h0YLL35bN3UZlG9V38bQ/nXnAsEHN9K5l97Ra7Gern3o8l6UQNmLOUYdvYADnWyoxq0uN4ZIuVaw/1qrrRgA==';

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

const DELIVERY_BASE_URI = 'https://deliveriesapi.ipaygh.com/';

// const baseURL =
//   process.env.NODE_ENV === 'development'
//     ? 'https://managed-services-api-uat-pjanjqoxfq-uc.a.run.app/apidev/v1/gateway/'
//     : 'https://managed-services-api-uat-pjanjqoxfq-uc.a.run.app/apidev/v1/gateway/';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'https://manage.ipaygh.com/api/v1/gateway/'
    : 'https://manage.ipaygh.com/api/v1/gateway/';

export const Api = axios.create({
  baseURL,
});

export const deliveryApi = axios.create({
  baseURL: DELIVERY_BASE_URI,
});

deliveryApi.interceptors.request.use(
  async request => {
    //@ts-ignore
    request.headers = {
      ...request.headers,
      'Content-Type': 'application/json',
      api_token: DELIVERY_API_TOKEN,
      user_id: DELIVERY_USER_ID,
      apitoken: DELIVERY_API_TOKEN,
      userid: DELIVERY_USER_ID,
    };
    return request;
  },
  error => Promise.reject(error),
);

// Api.interceptors.request.use(
//   async request => {
//     let timestamp = moment().format('x');
//     const secret = await appSecret(timestamp);
//     const user = await retrievePersistedData('user');
//     // const token = await AsyncStorage.getItem('fcmToken');
//     // if (request.data) {
//     //   request.data.notify_device = token;
//     // }

//     request.headers = {
//       ...request.headers,
//       Authentication: secret,
//       Time: timestamp,
//       Application: appId,
//       Accept: 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Sid: user.sid,
//     };

//     const formBody = [];
//     for (let i in request.data) {
//       const key = encodeURIComponent(i);
//       const value = encodeURIComponent(request.data[i]);
//       formBody.push(key + '=' + value);
//     }
//     request.data = formBody.join('&');
//     return request;
//   },
//   error => Promise.reject(error),
// );

export const loginApi = axios.create({
  baseURL,
});

loginApi.interceptors.request.use(
  async request => {
    let timestamp = moment().format('x');
    const secret = await appSecret(timestamp);
    request.headers = {
      ...request.headers,
      Authentication: secret,
      Time: timestamp,
      Application: appId,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
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
  error => Promise.reject(error),
);

export const productApi = axios.create({
  baseURL,
});

productApi.interceptors.request.use(
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
    console.log('therererere', error);
    Promise.reject(error);
  },
);

export const apiDemo = axios.create({
  baseURL,
});

apiDemo.interceptors.request.use(
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
  error => Promise.reject(error),
);

export const editProductApi = axios.create({
  baseURL,
});

editProductApi.interceptors.request.use(
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
      'Content-Type': 'aapplication/json',
      Sid: user.sid,
    };
    // const formBody = new FormData();
    // for (let i in request.data) {
    //   formBody.append(i, request.data[i]);
    // }
    // request.data = formBody;

    return request;
  },
  error => {
    console.log('therererere', error);
    Promise.reject(error);
  },
);

