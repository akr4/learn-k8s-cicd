import {env} from 'process';

type PodMetadata = {
    environment: string | undefined;
    nodeName: string | undefined;
    podName: string | undefined;
    podNamespace: string | undefined;
    podIpAddress: string | undefined;
    podServiceAccount: string | undefined;
    password: string | undefined;
}

export const getPodMetadata = (): PodMetadata => {
    return {
        environment: env.NEXT_PUBLIC_ENVIRONMENT,
        nodeName: env.NEXT_PUBLIC_MY_NODE_NAME,
        podName: env.NEXT_PUBLIC_MY_POD_NAME,
        podNamespace: env.NEXT_PUBLIC_MY_POD_NAMESPACE,
        podIpAddress: env.NEXT_PUBLIC_MY_POD_IP,
        podServiceAccount: env.NEXT_PUBLIC_MY_POD_SERVICE_ACCOUNT,
        password: env.NEXT_PUBLIC_PASSWORD,
    };
};
