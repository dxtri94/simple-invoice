import React, {useEffect, useState} from "react";
import {getCookies, setCookies} from "@/utils/cookies";
import {KEY_ACCESS_TOKEN, KEY_ORG_TOKEN, KEY_USER} from "@/constants/common";
import {notification} from "antd";
import authServices from "@/services/auth";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUser().catch(e => console.log(e));
  }, []);

  const fetchUser = async () => {
    await setLoading(true);

    const accessToken = getCookies(KEY_ACCESS_TOKEN);

    if (accessToken?.[KEY_ACCESS_TOKEN]) {

      const currentMembership = getCookies(KEY_USER);
      if (currentMembership) {
        setUser(currentMembership);
        setLoading(false);
      } else {
        try {
          const {data: memberShip, error: errMembership} = await authServices.getMembership();
          if (memberShip) {

            await setCookies(KEY_USER, memberShip?.data);
            await setCookies(KEY_ORG_TOKEN, {[KEY_ORG_TOKEN]: memberShip?.data?.memberships[0]?.token});

            setUser(memberShip?.data);
            setLoading(false);

          } else {
            console.log(errMembership)
            setLoading(false);

            notification.error({
              message: 'User not found',
              description: errMembership?.error || 'Something wrong!',
            })
          }
        } catch (e: any) {
          console.log(e)
          setLoading(false);
          notification.error({
            message: 'User not found',
            description: e?.error || 'Something wrong!',
          })
        }
      }

    } else {
      setLoading(false);
    }

  };

  return {user, loading};
};
