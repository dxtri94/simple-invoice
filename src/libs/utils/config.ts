import _ from 'lodash';
import Cookies from 'js-cookie'

const getConfigs = (): any => {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(<string>Cookies.get('env'));
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const getConfig = (key: string, defaultValue: string = '') => {
  return _.get(getConfigs(), key, defaultValue)
}

export const getApiConfig = (): any => {
  try {
    return {
      API_HOST: process.env.API_HOST,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      GRANT_TYPE: process.env.GRANT_TYPE,
      SCOPE: process.env.SCOPE,
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
