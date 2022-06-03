import {env} from 'process';

type PodMetadata = {
    nodeName: string | undefined;
    podName: string | undefined;
    podNamespace: string | undefined;
    podIpAddress: string | undefined;
    podServiceAccount: string | undefined;
    mySecret: string | undefined;
}

export const getPodMetadata = (): PodMetadata => {
    return {
        nodeName: env.NEXT_PUBLIC_MY_NODE_NAME,
        podName: env.NEXT_PUBLIC_MY_POD_NAME,
        podNamespace: env.NEXT_PUBLIC_MY_POD_NAMESPACE,
        podIpAddress: env.NEXT_PUBLIC_MY_POD_IP,
        podServiceAccount: env.NEXT_PUBLIC_MY_POD_SERVICE_ACCOUNT,
        mySecret: env.NEXT_PUBLIC_MY_SECRET,
    };
};
