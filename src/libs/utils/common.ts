import {NextApiRequest} from "next";
import {IncomingMessage} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";
import {KEY_ACCESS_TOKEN, KEY_ORG_TOKEN} from "@/constants/common";

export const getAccessToken = (req: NextApiRequest | IncomingMessage & {
  cookies: NextApiRequestCookies
}): string | undefined => {
  try {
    const {cookies} = req;
    return cookies?.[KEY_ACCESS_TOKEN];
  } catch (e) {
    console.error(e);
    return '';
  }
}

export const getOrgToken = (req: NextApiRequest | IncomingMessage & {
  cookies: NextApiRequestCookies
}): string | undefined => {
  try {
    const {cookies} = req;
    return cookies?.[KEY_ORG_TOKEN];
  } catch (e) {
    console.error(e);
    return '';
  }
}
