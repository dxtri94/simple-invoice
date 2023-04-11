import Head from 'next/head';
import {SITE_NAME} from '@/constants/common';

const Meta = () => {
  return (
    <Head>
      <link rel="manifest" href={"/favicon/manifest.json"}/>
      <meta name="msapplication-TileColor" content="#000000"/>
      <meta name="theme-color" content="#000000"/>
      <meta name="description" content={SITE_NAME}/>
    </Head>
  );
};

export default Meta;
