import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

type Props = {
    environment: string;
    podName: string;
    secret: string;
}

const Home: NextPage<Props> = ({environment, podName, secret}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>my-app</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>my-app</h1>

          <p className={styles.description}>
              Environment = <code className={styles.code}>{environment}</code><br/>
              Pod = <code className={styles.code}>{podName}</code><br/>
              Secret = <code className={styles.code}>{secret}</code><br/>
          </p>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            environment: process.env.WEBAPP_ENVIRONMENT,
            podName: process.env.WEBAPP_POD_NAME,
            secret: process.env.WEBAPP_SECRET,
        }
    }
}

export default Home
