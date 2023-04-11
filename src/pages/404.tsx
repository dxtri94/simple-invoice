import Head from 'next/head'
import LayoutDefault from '@/components/layout/default'
import {SITE_NAME} from '@/constants/common'
import {Button} from 'antd'
import {useRouter} from 'next/router'
import styles from '@/styles/404.module.scss'

const Custom404 = () => {
  const router = useRouter()

  return (
    <LayoutDefault>
      <Head>
        <title>{`404 | ${SITE_NAME}`}</title>
      </Head>

      <div className={styles.centerScreen}>
        <div>
          <h1 style={{marginBottom: '20px', fontSize: '2.5rem'}}>404 - NotFound!</h1>
          <Button onClick={() => router.push('/', '/')}
                  type="primary"
                  size='large'>Back to home</Button>
        </div>
      </div>
    </LayoutDefault>
  )
}

export default Custom404
