import {Layout} from 'antd'
import styles from './Footer.module.scss'

const {Footer} = Layout

const SiteFooter = () => {
  return (
    <Footer className={styles.siteFooter}>
      <div>
        <div>&copy; {new Date().getFullYear()} SimpleInvoice</div>
      </div>
    </Footer>
  )
}

export default SiteFooter
