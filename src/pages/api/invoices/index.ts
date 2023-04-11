import {IncomingMessage} from "http";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {getApiConfig} from "@/utils/config";
import {getAccessToken, getOrgToken} from "@/utils/common";
import Api from "@/utils/api";
import {KEY_ACCESS_TOKEN, KEY_ORG_TOKEN} from "@/constants/common";
import dayjs from "dayjs";

export const getInvoicesAPI = async (req: NextApiRequest | IncomingMessage & {
  cookies: NextApiRequestCookies
}): Promise<any> => {
  try {
    const env = getApiConfig();

    if (!env || !env?.API_HOST) {
      return Promise.reject({
        data: [],
        error: 'Permission denied!'
      });
    }

    const accessToken = getAccessToken(req);
    const orgToken = getOrgToken(req);

    let _parseAccessToken = null;
    let _orgToken = null;

    try {
      if (accessToken) {
        const tmp = JSON.parse(accessToken?.toString());
        _parseAccessToken = tmp?.[KEY_ACCESS_TOKEN];
      }
      if (orgToken) {
        const tmp2 = JSON.parse(orgToken?.toString());
        _orgToken = tmp2?.[KEY_ORG_TOKEN];
      }
    } catch (e) {
      _parseAccessToken = null;
      _orgToken = null;
    }

    if (!_parseAccessToken || !_orgToken) {
      return Promise.reject({
        data: [],
        error: 'Permission denied!'
      });
    }

    const {API_HOST} = env;

    const {data, error} = await Api.get({
      url: `${API_HOST}/invoice-service/1.0.0/invoices`,
      params: {
        pageNum: 1,
        pageSize: 10,
        fromDate: dayjs()?.add(-30, 'd')?.format('YYYY-MM-DD'),
        toDate: dayjs()?.format('YYYY-MM-DD'),
      },
      accessToken: _parseAccessToken,
      orgToken: _orgToken
    })

    return {
      data,
      error
    }
  } catch (e: any) {
    console.log("Fetch invoice error: ", e);
    return Promise.reject(e);
  }
}

const invoicesHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      query: {
        fromDate,
        toDate,
        pageSize,
        pageNum,
        ordering,
        sortBy,
        status,
        keyword
      }
    } = req;

    const env = getApiConfig();

    if (!env || !env?.API_HOST) {
      return res.status(401).json({error: 'Permission denied!'});
    }

    const accessToken = getAccessToken(req) || null;
    const orgToken = getOrgToken(req) || null;

    let _parseAccessToken = null;
    let _orgToken = null;

    try {
      if (accessToken) {
        const tmp = JSON.parse(accessToken);
        _parseAccessToken = tmp?.[KEY_ACCESS_TOKEN];
      }

      if (orgToken) {
        const tmp2 = JSON.parse(orgToken);
        _orgToken = tmp2?.[KEY_ORG_TOKEN];
      }
    } catch (e) {
      _parseAccessToken = null;
      _orgToken = null;
    }

    if (!_parseAccessToken || !_orgToken) {
      return res.status(401).json({error: 'Permission denied!'});
    }

    const {API_HOST} = env;

    switch (method) {
      case 'GET':
        const {data, error} = await Api.get({
          url: `${API_HOST}/invoice-service/1.0.0/invoices`,
          params: {
            fromDate,
            toDate,
            pageSize,
            pageNum,
            ordering,
            sortBy,
            status,
            keyword
          },
          accessToken: _parseAccessToken,
          orgToken: _orgToken
        });
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(500).json(error || {error: 'Something went wrong. Try Again!'});
        }
      default:
        return res.status(404).json({error: 'API Not found!'})
    }

  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json(error || {error: 'Something went wrong. Try Again!'})
  }
}

export default invoicesHandler;
