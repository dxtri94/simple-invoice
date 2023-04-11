import _ from 'lodash';
import Cookies from 'js-cookie'

export const getCookies = (cookies: string): any => {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(<string>Cookies.get(cookies));
  } catch (error) {
    return null;
  }
}

export const setCookies = async (cookies: string, payload: any, expires?: number) => {
  if (typeof document === 'undefined') {
    return null;
  }
  await Cookies.set(cookies, typeof payload === "string" ? payload : JSON.stringify(payload), {
    expires: expires ? expires : ((new Date()).setTime(new Date().getTime() + 12 * 60 * 60 * 1000))
  })
}

export const removeCookies = async (cookies: string) => {
  if (typeof document === 'undefined') {
    return null
  }
  await Cookies.remove(cookies)
}

export const getFieldCookies = (cookies: string, key: string, defaultValue: string = '') => {
  return _.get(getCookies(cookies), key, defaultValue)
}
