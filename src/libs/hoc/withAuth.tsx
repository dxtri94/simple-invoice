import {useRouter} from "next/router";
import {useAuth} from "@/hooks/useAuth";
import {notification} from "antd";

export const withAuth = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const {user, loading} = useAuth();

    if (!loading && !user) {
      router.push('/login');
      notification.error({
        message: 'Token has been expired!',
        description: 'Your token has been expired. Please login again to continue using our app. Thank you!'
      })
      return null;
    }

    return <Component {...props} user={user}/>;
  };

  return AuthenticatedComponent;
};
