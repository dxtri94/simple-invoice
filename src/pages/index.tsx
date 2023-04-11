import Head from 'next/head'
import LayoutDefault from '@/components/layout/default'
import {SITE_NAME} from '@/constants/common'
import React from "react";
import {withAuth} from "@/hoc/withAuth";

const Home: React.FC = () => {
  return (
    <LayoutDefault>
      <Head>
        <title>${SITE_NAME}</title>
      </Head>
      <div>HOME PAGE</div>
    </LayoutDefault>
  )
}
export default withAuth(Home)
