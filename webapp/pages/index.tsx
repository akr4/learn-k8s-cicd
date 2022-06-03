import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {getPodMetadata} from "../podMetada";

type Props = {
    environment: string;
    podName: string;
    password: string;
}

const Home: NextPage<Props> = ({environment, podName, password}) => {
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
              Password = <code className={styles.code}>{password}</code><br/>
          </p>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {nodeName, podName, podIpAddress, password, environment} = getPodMetadata();

    return {
        props: {
            environment,
            podName,
            password,
        }
    }
}

export default Home
