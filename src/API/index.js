import axios from 'axios';
import {Platform, Alert} from 'react-native';
import {BASE_URL, END_POINT} from './UrlProvider';
import {LogoutHandle} from '../utils/LogoutHandle';

export const getAuthAPI = async (
  endPoint,
  userToken = null,
  navigation = null,
  callback,
) => {
  try {
    const config = {
      method: 'get',
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Content-Type': 'application/json',
        timeout: 10000,
        ...(userToken && {Authorization: userToken}),
      },
    };
    axios(config)
      .then(function (response) {
        if (response) {
          callback({status: true, data: response?.data});
        } else {
          callback({status: false, data: null});
        }
      })
      .catch(function (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 401
        ) {
          if (navigation) {
            LogoutHandle(navigation);
          }
        }
        callback({status: false, error: error?.masssage, data: null});
      });
  } catch (error) {
    callback({status: false, error: error, data: null});
  }
};

export const postAuthAPI = (
  body = null,
  endPoint,
  userToken = null,
  navigation = null,
  callback,
) => {
  try {
    const config = {
      method: 'post',
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        timeout: 10000,
        ...(userToken && {Authorization: userToken}),
      },
      ...(body && {data: body}),
    };
    axios(config)
      .then(async function (response) {
        if (response?.status === 200 || response?.status === 201) {
          callback({status: true, data: response?.data?.data});
        } else {
          callback({status: false, data: null});
        }
      })
      .catch(function (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 401
        ) {
          if (navigation) {
            LogoutHandle(navigation);
          } else {
          }
        }
        callback({
          status: false,
          error: error,
          data: null,
          message: error?.response?.data?.message || error?.message || '',
        });
      });
  } catch (error) {
    callback({
      status: false,
      error: error?.response?.data?.message || error?.message,
      data: null,
      type: 'catch',
    });
  }
};

export const putAuthAPI = (
  body = null,
  endPoint,
  userToken = null,
  navigation = null,
  callback,
) => {
  try {
    const config = {
      method: 'put',
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        timeout: 10000,
        ...(userToken && {Authorization: userToken}),
      },
      ...(body && {data: body}),
    };
    axios(config)
      .then(async function (response) {
        if (response?.status === 200 || response?.status === 201) {
          callback({status: true, data: response?.data?.data});
        } else {
          callback({status: false, data: null});
        }
      })
      .catch(function (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 401
        ) {
          if (navigation) {
            LogoutHandle(navigation);
          }
        }

        callback({status: false, error: error, data: null, message: ''});
      });
  } catch (error) {
    callback({status: false, error: error, data: null, type: 'catch'});
  }
};

export const postFileUploadAPI = (
  body = null,
  endPoint,
  userToken = null,
  navigation = null,
  callback,
) => {
  try {
    const config = {
      method: 'post',
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        ...(userToken && {Authorization: userToken}),
      },
      data: body,
    };

    axios(config)
      .then(async function (response) {
        if (response?.status === 200 || response?.status === 201) {
          callback({status: true, data: response?.data});
        } else {
          callback({status: false, data: null});
        }
      })
      .catch(function (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 401
        ) {
          if (navigation) {
            LogoutHandle(navigation);
          }
        }
        callback({
          status: false,
          error: error,
          data: null,
          message: error?.response?.data?.message || error?.message || '',
        });
      });
  } catch (error) {
    callback({
      status: false,
      error: error?.message || error,
      data: null,
      type: 'catch',
    });
  }
};

export const putFileUploadAPI = (
  body = null,
  endPoint,
  userToken = null,
  navigation = null,
  callback,
) => {
  try {
    const config = {
      method: 'put',
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        ...(userToken && {Authorization: userToken}),
      },
      data: body,
    };

    axios(config)
      .then(async function (response) {
        if (response?.status === 200 || response?.status === 201) {
          callback({status: true, data: response?.data});
        } else {
          callback({status: false, data: null});
        }
      })
      .catch(function (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 401
        ) {
          if (navigation) {
            LogoutHandle(navigation);
          }
        }
        callback({
          status: false,
          error: error,
          data: null,
          message: error?.response?.data?.message || error?.message || '',
        });
      });
  } catch (error) {
    callback({
      status: false,
      error: error?.message || error,
      data: null,
      type: 'catch',
    });
  }
};

export const API = {
  getAuthAPI,
  postAuthAPI,
  putAuthAPI,
  postFileUploadAPI,
  putFileUploadAPI,
};
