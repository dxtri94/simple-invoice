import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next'
import Api from "@/utils/api";
import {getApiConfig} from "@/utils/config";

const loginHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body
    } = req;

    const env = getApiConfig();

    if (!env || !env?.API_HOST) {
      return res.status(401).json({error: 'Permission denied!'})
    }

    const {API_HOST, CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, SCOPE} = env;
    let _parseBody = null;

    try {
      _parseBody = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({error: 'Missing param!'})
    }

    switch (method) {
      case 'POST':
        const {data, error} = await Api.login({
          url: `${API_HOST}/token`,
          payload: {
            username: _parseBody?.username,
            password: _parseBody?.password,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: GRANT_TYPE,
            scope: SCOPE
          }
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

export default loginHandler;
