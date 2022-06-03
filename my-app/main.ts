import { Construct } from "constructs";
import * as cdk8s from "cdk8s";
import * as kplus from "cdk8s-plus-23";
import {loadSecretsFile, loadValuesFile} from "./values";

export class MyChart extends cdk8s.Chart {
  constructor(scope: Construct, id: string, props: cdk8s.ChartProps = {}) {
    super(scope, id, props);


    const config = new kplus.ConfigMap(this, "config", {
      metadata: {
        name: "main",
      },
      data: loadValuesFile(),
    });

    const secret = new kplus.Secret(this, "secret", {
      metadata: {
        name: "main",
      },
      stringData: loadSecretsFile(),
    });

    const webapp = {
      name: "webapp",
      image: "my-app-webapp:4",
      imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
      port: 3000,
      envVariables: {
        NEXT_PUBLIC_ENVIRONMENT: kplus.EnvValue.fromConfigMap(
          config,
          "environment"
        ),
        NEXT_PUBLIC_MY_NODE_NAME: kplus.EnvValue.fromFieldRef(
          kplus.EnvFieldPaths.NODE_NAME
        ),
        NEXT_PUBLIC_MY_POD_NAME: kplus.EnvValue.fromFieldRef(
          kplus.EnvFieldPaths.POD_NAME
        ),
        NEXT_PUBLIC_PASSWORD: kplus.EnvValue.fromSecretValue({
          secret,
          key: "password",
        }),
      },
    };

    const deployment = new kplus.Deployment(this, "deployment", {
      replicas: 3,
      containers: [webapp],
    });

    deployment.exposeViaService({ serviceType: kplus.ServiceType.CLUSTER_IP });
  }
}

const app = new cdk8s.App();
new MyChart(app, "my-app");
app.synth();
