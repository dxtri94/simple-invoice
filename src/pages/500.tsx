import Head from 'next/head'
import LayoutDefault from '@/components/layout/default'
import {SITE_NAME} from '@/constants/common'
import {Button} from 'antd'
import {useRouter} from 'next/router'
import styles from '@/styles/500.module.scss'

const Custom500 = () => {
  const router = useRouter()

  return (
    <LayoutDefault>
      <Head>
        <title>{`500 Internal Server Error | ${SITE_NAME}`}</title>
      </Head>

      <div className={styles.centerScreen}>
        <div>
          <h1 style={{marginBottom: '20px', fontSize: '2.5rem'}}>
            500 - 500 Internal Server Error
          </h1>
          <Button onClick={() => router.push('/', '/')} type="primary"
                  size='large'>Back to Home</Button>
        </div>
      </div>
    </LayoutDefault>
  )
}

export default Custom500
