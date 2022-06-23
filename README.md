# k8s-cicd

k8s の学習を兼ねて Kubernetes で CI/CD パイプラインを実装してみる。

- GCP を使う
- プロジェクト名 `k8s-cicd`

## セットアップ

```bash
# クラスター作成
gcloud container clusters create main --addons HttpLoadBalancing,HorizontalPodAutoscaling,NetworkPolicy

# Artifact Registory にリポジトリを作成
gcloud artifacts repositories create webapp --repository-format=docker --location=asia-northeast1
```



## 終了

```bash
# クラスター削除
gcloud container clusters delete main
```



## TODO

- [ ] GCP のサービスアカウントの権限を限定する
- [ ] ワークフローの起動タイミング調整 (コンテナのビルドとデプロイの依存関係調整)
- [ ] 複数環境へのデプロイ
- [ ] EKS

## ワークフロー (案)

### リリース用コンテナビルド

- `v*` のタグがついている場合にコンテナのビルドを行いそのタグをつける
- ステージング環境とプロダクション環境で利用する

```mermaid
flowchart LR
  repo[GitHub Repo]
  developer(("🙋‍♀️"))
  registry[Container registry]
  gha[GitHub Actions]

  developer -->|push| repo
  
  repo --> |on push v* tag| gha
  
  gha -->|push| registry

```

### 

### 開発環境

- `main` ブランチへの push によりコンテナのビルドと開発環境の更新を行う

```mermaid
flowchart LR
  main[main]
  developer(("🙋‍♀️"))
  registry[Container registry]
  gha[GitHub Actions]
  cluster[k8s cluster]

  developer -->|push| main
  
  main --> |on push| gha
  
  gha -->|1. push| registry
  cluster -->|hash| registry
  gha -->|2. kubectl apply| cluster

```

### ステージング環境

- `staging` ブランチへの push によりステージング環境の更新を行う (`manifests` ディレクトリに変更がある場合のみ)

```mermaid
flowchart LR
  staging[staging]
  developer(("🙋‍♀️"))
  registry[Container registry]
  gha[GitHub Actions]
  cluster[k8s cluster]

  developer -->|push| staging
  
  staging --> |on push| gha
  
  cluster -->|v* tag| registry
  gha -->|kubectl apply| cluster

```

### 本番環境

- `production` ブランチへの push により本番環境の更新を行う (`manifests` ディレクトリに変更がある場合のみ)

```mermaid
flowchart LR
  production[production]
  developer(("🙋‍♀️"))
  registry[Container registry]
  gha[GitHub Actions]
  cluster[k8s cluster]

  developer -->|push| production
  
  production --> |on push| gha
  
  cluster -->|v* tag| registry
  gha -->|kubectl apply| cluster

```

