import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import {
  KubeConfigMap,
  KubeDeployment,
  KubeSecret,
  KubeService,
} from "./imports/k8s";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const label = { app: "my-app" };

    new KubeConfigMap(this, "configmap", {
      metadata: {
        name: "main",
      },
      data: {
        configmapKey: "value from configmap",
      },
    });

    new KubeSecret(this, "secret", {
      metadata: {
        name: "main",
      },
      stringData: {
        mySecret: "MY SECRET!",
      },
    });

    new KubeService(this, "service", {
      spec: {
        type: "ClusterIP",
        ports: [
          {
            port: 3000,
          },
        ],
        selector: label,
      },
    });

    new KubeDeployment(this, "deployment", {
      spec: {
        replicas: 3,
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: "webapp",
                image: "my-app-webapp:1",
                ports: [
                  {
                    containerPort: 3000,
                  },
                ],
                env: [
                  {
                    name: "NEXT_PUBLIC_MY_NODE_NAME",
                    valueFrom: {
                      fieldRef: {
                        fieldPath: "spec.nodeName",
                      },
                    },
                  },
                  {
                    name: "NEXT_PUBLIC_MY_POD_NAME",
                    valueFrom: {
                      fieldRef: {
                        fieldPath: "metadata.name",
                      },
                    },
                  },
                  {
                    name: "NEXT_PUBLIC_CONFIG_MAP_KEY",
                    valueFrom: {
                      configMapKeyRef: {
                        name: "main",
                        key: "configmapKey",
                      },
                    },
                  },
                  {
                    name: "NEXT_PUBLIC_MY_SECRET",
                    valueFrom: {
                      secretKeyRef: {
                        name: "main",
                        key: "mySecret",
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });
  }
}

const app = new App();
new MyChart(app, "my-app");
app.synth();
