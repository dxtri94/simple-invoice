interface GetParams {
  url: string;
  params?: any;
  accessToken?: string;
  orgToken?: string;
}

interface PutParams {
  url: string;
  payload?: object;
}

interface PostParams {
  url: string;
  payload?: any;
}

const getGetParams = (object: { [key: string]: string; }) => {
  const paramList = (Object.keys(object) as (keyof typeof object)[]).map((key) => {
    if (object[key]) {
      return `${key}=${encodeURIComponent(String(object[key]))}`;
    }
    return '';
  });
  return paramList.filter((f) => f !== '').map(i => i).join('&');
}

const get = async ({url, params, accessToken = '', orgToken = ''}: GetParams): Promise<{ data: any, error: any }> => {
  let _url = url;

  if (params && Object.keys(params)?.length) {
    const parseParams = getGetParams(params);
    _url = `${_url}?${parseParams}`;
  }

  let header: any = {
    'Content-Type': 'application/json'
  };

  if (accessToken) {
    header['Authorization'] = `Bearer ${accessToken}`;
  }

  if (orgToken) {
    header['org-token'] = orgToken;
  }

  const opt = accessToken ? {
    method: 'GET',
    headers: header,
  } : {
    method: 'GET',
  }

  const response = await fetch(_url, opt);

  if (response?.ok) {
    const data = await response.json();
    if (data) {
      return Promise.resolve({
        data,
        error: null
      });
    }
    return Promise.reject({
      data: null,
      error: response?.statusText
    });
  } else {
    return Promise.reject({
      data: null,
      error: response?.statusText
    });
  }
}

const post = async ({url, payload}: PostParams): Promise<{ data: any, error: any }> => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (response?.ok) {
    const data = await response.json();
    if (data) {
      return {
        data,
        error: null
      };
    }
    return {
      data: null,
      error: 'Data not found!'
    };
  } else {
    throw Error('Something went wrong. Try Again!');
  }
}

const login = async ({url, payload}: PostParams): Promise<{ data: any, error: any }> => {
  const formBody = Object.entries(payload)
    .map(([key, value]: any) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })

  if (response?.ok) {
    const data = await response.json();
    if (data) {
      return {
        data,
        error: null
      };
    }
    return {
      data: null,
      error: 'Data not found!'
    };
  } else {
    throw Error('Something went wrong. Try Again!');
  }
}

const put = async ({url, payload}: PutParams): Promise<{ data: any, error: any }> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (response?.ok) {
    const data = await response.json();

    if (data) {
      return {
        data,
        error: null
      };
    }
    return {
      data: null,
      error: 'Data not found!'
    };
  } else {
    throw Error('Something went wrong. Try Again!');
  }
}

const getExt = async ({url}: { url: string }): Promise<{ data: any, error: any }> => {
  const response = await fetch(url, {
    method: 'GET',
  })
  if (response?.ok) {
    const data = await response.json();
    if (data) {
      return {
        data,
        error: null
      };
    }
    return {
      data: null,
      error: 'Data not found!'
    };
  } else {
    throw Error('Something went wrong. Try Again!');
  }
}

const API_SERVICE = {
  get,
  post,
  put,
  getExt,
  login
}

export default API_SERVICE;
