import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {getPodMetadata} from "../podMetada";

type Props = {
    podName: string;
    mySecret: string;
}

const Home: NextPage<Props> = ({podName, mySecret}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>my-app</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>my-app</h1>

          <p className={styles.description}>
              Pod = <code className={styles.code}>{podName}</code><br/>
              Secret = <code className={styles.code}>{mySecret}</code><br/>
          </p>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {nodeName, podName, podIpAddress, mySecret} = getPodMetadata();

    console.log(JSON.stringify({podName, mySecret}, null, 2));

    return {
        props: {
            podName,
            mySecret,
        }
    }
}

export default Home
