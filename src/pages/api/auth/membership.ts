import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next'
import Api from "@/utils/api";
import {getApiConfig} from "@/utils/config";
import {getAccessToken} from "@/utils/common";
import {KEY_ACCESS_TOKEN} from "@/constants/common";

const memberShipHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body
    } = req;

    const env = getApiConfig();

    if (!env || !env?.API_HOST) {
      return res.status(401).json({error: 'Permission denied!'})
    }

    const accessToken = getAccessToken(req);
    let _parseAccessToken = null;

    try {
      if (accessToken) {
        const tmp = JSON.parse(accessToken?.toString());
        _parseAccessToken = tmp?.[KEY_ACCESS_TOKEN];
      }
    } catch (e) {
      _parseAccessToken = null;
    }

    if (!_parseAccessToken) {
      return res.status(401).json({error: 'Permission denied!'})
    }

    const {API_HOST} = env;

    switch (method) {
      case 'GET':
        const {data, error} = await Api.get({
          url: `${API_HOST}/membership-service/1.2.0/users/me`,
          params: null,
          accessToken: _parseAccessToken
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

export default memberShipHandler;
