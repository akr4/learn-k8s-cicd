import {Construct} from "constructs";
import * as cdk8s from "cdk8s";
import * as kplus from "cdk8s-plus-23";
import {HttpIngressPathType} from "cdk8s-plus-23";
import {loadSecretsFile, loadValuesFile} from "./values";

const DOCKER_REGISTRY = process.env.DOCKER_REGISTRY;

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
      image: `${DOCKER_REGISTRY}/akr4/learn-k8s-cicd-webapp:v1.0.0`,
      imagePullPolicy: kplus.ImagePullPolicy.IF_NOT_PRESENT,
      port: 3000,
      envVariables: {
        WEBAPP_ENVIRONMENT: kplus.EnvValue.fromConfigMap(
          config,
          "environment"
        ),
        WEBAPP_POD_NAME: kplus.EnvValue.fromFieldRef(
          kplus.EnvFieldPaths.POD_NAME
        ),
        WEBAPP_SECRET: kplus.EnvValue.fromSecretValue({
          secret,
          key: "secret",
        }),
      },
    };

    const deployment = new kplus.Deployment(this, "deployment", {
      metadata: {
        name: "webapp"
      },
      replicas: 2,
      containers: [webapp],
    });

    const service = deployment.exposeViaService({ name: "webapp", serviceType: kplus.ServiceType.NODE_PORT });

    new kplus.Ingress(this, "ingress", {
      metadata: {
        annotations: {
          'nginx.ingress.kubernetes.io/rewrite-target': '/$1',
        }
      },
      rules: [
        {
          host: 'webapp.local',
          path: '/',
          pathType: HttpIngressPathType.PREFIX,
          backend: kplus.IngressBackend.fromService(service),
        }
      ]
    });
  }
}

const app = new cdk8s.App();
new MyChart(app, "learn-k8s-cicd");
app.synth();
