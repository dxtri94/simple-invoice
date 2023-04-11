import type {AppProps} from 'next/app'
import {NextPage} from 'next'
import React, {ReactElement, ReactNode} from 'react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({Component, pageProps}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <React.StrictMode>
      {getLayout(<Component {...pageProps} />)}
    </React.StrictMode>
  )
}

export default MyApp
