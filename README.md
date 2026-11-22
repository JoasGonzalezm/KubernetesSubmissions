# DevOps with Kubernetes — submissions

Images are built by GitHub Actions on every tag and pushed to
`ghcr.io/joasgonzalezm/<app>:<exercise>`.

## Exercises

### Chapter 2

- [1.1.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.1/log_output)
- [1.2.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.2/todo_app)
- [1.3.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.3/log_output)
- [1.4.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.4/todo_app)
- [1.5.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.5/todo_app)
- [1.6.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.6/todo_app)
- [1.7.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.7/log_output)
- [1.8.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.8/todo_app)
- [1.9.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.9/ping_pong)
- [1.10.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.10/log_output)
- [1.11.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.11/volumes) (also [log_output](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.11/log_output) and [ping_pong](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.11/ping_pong))
- [1.12.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.12/todo_app)
- [1.13.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/1.13/todo_app)

### Chapter 3

- [2.1.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.1/log_output) (also [ping_pong](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.1/ping_pong))
- [2.2.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.2/todo_backend) (also [todo_app](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.2/todo_app))
- [2.3.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.3/namespaces) (also [log_output](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.3/log_output) and [ping_pong](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.3/ping_pong))
- [2.4.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.4/namespaces) (also [todo_app](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.4/todo_app) and [todo_backend](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.4/todo_backend))
- [2.5.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.5/log_output)
- [2.6.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.6/todo_app) (also [todo_backend](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.6/todo_backend))
- [2.7.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.7/ping_pong)
- [2.8.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.8/todo_backend)
- [2.9.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.9/todo_cronjob)
- [2.10.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.10/todo_backend) (also [monitoring](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/2.10/monitoring))

### Chapter 4

- [3.1.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.1/ping_pong)
- [3.2.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.2/log_output) (also [ping_pong](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.2/ping_pong))
- [3.3.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.3/log_output) (also [ping_pong](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.3/ping_pong))
- [3.4.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.4/ping_pong)
- [3.5.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.5/project)
- [3.6.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.6/.github/workflows) (also [project](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.6/project))
- [3.7.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.7/.github/workflows)
- [3.8.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.8/.github/workflows)
- [3.9.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.9#39-dbaas-vs-diy)
- [3.10.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.10/todo_backup)
- [3.11.](https://github.com/joasgonzalezm/KubernetesSubmissions/tree/3.11/project)

## Running

```
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

### 1.1

```
kubectl create deployment log-output --image=ghcr.io/joasgonzalezm/log-output:1.1
kubectl logs -f deployment/log-output
```

### 1.2

```
kubectl create deployment todo-app --image=ghcr.io/joasgonzalezm/todo-app:1.2
kubectl logs deployment/todo-app
```

### 1.3

```
kubectl apply -f log_output/manifests/deployment.yaml
kubectl logs -f deployment/log-output-dep
```

### 1.4

```
kubectl apply -f todo_app/manifests/deployment.yaml
kubectl logs deployment/todo-app-dep
```

### 1.5

```
kubectl apply -f todo_app/manifests/deployment.yaml
kubectl port-forward deployment/todo-app-dep 3003:3000
# open http://localhost:3003
```

### 1.6

```
kubectl apply -f todo_app/manifests
# open http://localhost:8082
```

### 1.7

```
kubectl apply -f log_output/manifests
# open http://localhost:8081/status
```

### 1.8

```
kubectl delete ingress log-output-ingress
kubectl apply -f todo_app/manifests
# open http://localhost:8081
```

### 1.9

The ping-pong app shares the ingress of log output (`log_output/manifests/ingress.yaml`).

```
kubectl apply -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong
```

### 1.10

Log output is split into `log_output/writer` and `log_output/reader`, two containers
in the same pod sharing an `emptyDir` volume.

```
kubectl apply -f log_output/manifests
kubectl logs deployment/log-output-dep -c log-writer
# open http://localhost:8081/status
```

### 1.11

The PersistentVolume and its claim live in `volumes/` since they are not application specific.

```
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
kubectl apply -f volumes -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong a few times, then http://localhost:8081/status
```

### 1.12

The todo app caches an image from Lorem Picsum into a persistent volume for 10 minutes.
`GET /shutdown` crashes the container to test that the cached image survives.

```
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube-todo
kubectl apply -f volumes -f todo_app/manifests
# open http://localhost:8081
```

### 1.13

```
kubectl apply -f todo_app/manifests
# open http://localhost:8081
```

### 2.1

Log output asks ping-pong for the count over HTTP (`GET /pings`), no shared volume anymore.

```
kubectl apply -f ping_pong/manifests -f log_output/manifests
# open http://localhost:8081/pingpong a few times, then http://localhost:8081/status
```

### 2.2

`todo_backend` keeps the todos (`GET /todos`, `POST /todos`). The todo app renders them
server side and forwards the form to the backend.

```
kubectl apply -f volumes -f todo_backend/manifests -f todo_app/manifests
# open http://localhost:8081
```

### 2.3

Log output and ping-pong live in the `exercises` namespace.

```
kubectl apply -f namespaces/exercises.yaml
kubectl apply -f ping_pong/manifests -f log_output/manifests
kubectl get all -n exercises
```

### 2.4

Everything of the project lives in the `project` namespace.

```
kubectl apply -f namespaces/project.yaml
kubectl apply -f volumes -f todo_backend/manifests -f todo_app/manifests
kubectl get all -n project
```

### 2.5

The ConfigMap `log_output/manifests/configmap.yaml` provides `information.txt` (mounted
as a file) and `MESSAGE` (env variable).

```
kubectl apply -f log_output/manifests
# open http://localhost:8081/status
```

### 2.6

The project apps have no hard coded configuration, everything comes from the ConfigMaps
`todo_app/manifests/configmap.yaml` and `todo_backend/manifests/configmap.yaml`.

```
kubectl apply -f volumes -f todo_backend/manifests -f todo_app/manifests
```

### 2.7

Ping-pong stores the counter in Postgres running as a StatefulSet. The database
credentials are a Secret encrypted with [SOPS](https://github.com/getsops/sops) and age
(`ping_pong/secrets/secret.enc.yaml`, see `.sops.yaml`).

```
export SOPS_AGE_KEY_FILE=<path to key.txt>
sops --decrypt ping_pong/secrets/secret.enc.yaml | kubectl apply -f -
kubectl apply -f ping_pong/manifests
# open http://localhost:8081/pingpong
```

### 2.8

The todo backend stores the todos in Postgres (StatefulSet). Connection settings come from
the ConfigMap and the credentials from a SOPS encrypted Secret.

```
sops --decrypt todo_backend/secrets/secret.enc.yaml | kubectl apply -f -
kubectl apply -f volumes -f todo_backend/manifests -f todo_app/manifests
```

### 2.9

A CronJob creates every hour a todo `Read <random Wikipedia article>`.

```
kubectl apply -f todo_cronjob/manifests
kubectl create job -n project --from=cronjob/wikipedia-todo wikipedia-todo-now   # run it right away
```

### 2.10

The backend logs every request as JSON and rejects todos longer than 140 characters.
Logs are collected with Loki/Alloy and viewed in Grafana (`monitoring/`).

```
sh monitoring/install.sh
kubectl apply -f todo_backend/manifests
kubectl port-forward -n project svc/todo-backend-svc 3001:2345 &
curl -X POST -H 'Content-Type: application/json' \
  -d "{\"text\":\"$(printf 'x%.0s' $(seq 141))\"}" localhost:3001/todos   # -> 400
kubectl port-forward -n monitoring svc/grafana 3000:80
# Grafana -> Explore -> Loki: {namespace="project"} |= "todo rejected"
```

### GKE cluster (chapter 4 onwards)

```
gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.36 \
  --disk-size=32 --num-nodes=3 --machine-type=e2-small
gcloud container clusters get-credentials dwk-cluster --zone=europe-north1-b
```

### 3.1

Ping-pong (with its Postgres) in GKE, exposed with a LoadBalancer service.

```
kubectl apply -f namespaces/exercises.yaml
sops --decrypt ping_pong/secrets/secret.enc.yaml | kubectl apply -f -
kubectl apply -f ping_pong/manifests
kubectl get svc -n exercises ping-pong-svc   # wait for EXTERNAL-IP
# open http://<EXTERNAL-IP>/pingpong
```

### 3.2

Log output and ping-pong in GKE behind an Ingress: `/` goes to log output and `/pingpong`
to ping-pong. Both apps answer 200 in `/` for the GKE health check.

```
kubectl apply -f ping_pong/manifests -f log_output/manifests
kubectl get ingress -n exercises   # wait for ADDRESS
# open http://<ADDRESS>/ and http://<ADDRESS>/pingpong
```

### 3.3

The Ingress is replaced with the Gateway API: a Gateway (`log_output/manifests/gateway.yaml`)
and one HTTPRoute per app.

```
gcloud container clusters update dwk-cluster --location=europe-north1-b --gateway-api=standard
kubectl delete ingress -n exercises log-output-ingress
kubectl apply -f ping_pong/manifests -f log_output/manifests
kubectl get gateway -n exercises   # wait for ADDRESS
```

### 3.4

The ping-pong HTTPRoute rewrites `/pingpong` to `/`, so the app itself serves the pongs in
`/`. The GKE health check is pointed to `/healthz` with a HealthCheckPolicy so it does not
increase the counter.

```
kubectl apply -f ping_pong/manifests
# open http://<ADDRESS>/pingpong
```

### 3.5

The project is deployed with Kustomize: `project/kustomization.yaml` combines the manifests
of todo_app, todo_backend and todo_cronjob, sets the namespace and the images. The image
cache PVC uses the default storage class, so it works both in k3d and GKE.

```
kubectl create namespace project
sops --decrypt todo_backend/secrets/secret.enc.yaml | kubectl apply -n project -f -
kubectl apply -k project
kubectl get ingress -n project   # wait for ADDRESS
```

### 3.6

`.github/workflows/project.yml` builds the three project images, pushes them to Artifact
Registry and deploys the project with Kustomize on every push to main. The todo app uses the
`Recreate` strategy since its image cache PVC is `ReadWriteOnce`.

One time setup in Google Cloud (replace `PROJECT_ID` and `PROJECT_NUMBER`):

```
gcloud artifacts repositories create dwk-repository --repository-format=docker --location=europe-north1

gcloud iam service-accounts create github-actions-sa --display-name="GitHub Actions SA"
gcloud projects add-iam-policy-binding PROJECT_ID --role=roles/artifactregistry.writer \
  --member=serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding PROJECT_ID --role=roles/container.admin \
  --member=serviceAccount:github-actions-sa@PROJECT_ID.iam.gserviceaccount.com

gcloud iam workload-identity-pools create github-pool --location=global
gcloud iam workload-identity-pools providers create-oidc github-provider --location=global \
  --workload-identity-pool=github-pool \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='JoasGonzalezm/KubernetesSubmissions'" \
  --issuer-uri=https://token.actions.githubusercontent.com
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-sa@PROJECT_ID.iam.gserviceaccount.com --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/JoasGonzalezm/KubernetesSubmissions"
```

GitHub configuration:

```
gh variable set GKE_PROJECT --body PROJECT_ID
gh secret set SERVICE_ACCOUNT --body github-actions-sa@PROJECT_ID.iam.gserviceaccount.com
gh secret set WORKLOAD_IDENTITY_PROVIDER \
  --body projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
gh secret set SOPS_AGE_KEY < key.txt
```

### 3.7

Every branch gets its own environment: `main` is deployed to the namespace `project` and any
other branch to a namespace with the same name as the branch (`kustomize edit set namespace`).
The database Secret has no namespace so it can be applied to any of them.

```
git switch -c feature-x && git push -u origin feature-x
kubectl get all -n feature-x
```

### 3.8

`.github/workflows/delete-environment.yml` deletes the namespace of a branch when the branch is
deleted (the `main` environment is never deleted).

```
git push origin --delete feature-x
kubectl get namespace feature-x   # gone after the workflow has run
```

### 3.9 DBaaS vs DIY

Comparison of a managed database (DBaaS, e.g. Google Cloud SQL for PostgreSQL) and running
Postgres ourselves in the cluster as a StatefulSet with a PersistentVolumeClaim (DIY), which
is what the project does now.

**Initialization: work and cost**

| | DBaaS (Cloud SQL) | DIY (StatefulSet + PVC) |
|---|---|---|
| Work to set up | A few clicks or one `gcloud sql instances create`. Networking (private IP or the Cloud SQL Auth Proxy sidecar) and IAM need some extra setup. | Write the StatefulSet, headless Service, Secret and volume claim templates. Small for one replica, but replication, failover and connection pooling are all up to us. |
| Cost to start | Billed per instance even when idle. The smallest shared core instance is cheap but noticeably more than the disk alone. High availability doubles the price. | Only the persistent disk and a share of node resources we pay for anyway. Nearly free in a cluster that already exists. |

**Maintenance**

| | DBaaS | DIY |
|---|---|---|
| Updates | Google patches the OS and minor versions in maintenance windows. Major upgrades are a button. | We bump the image tag ourselves, and major versions need `pg_upgrade` or a dump and restore. |
| Availability | Regional HA with automatic failover is a setting. | One replica means downtime when the pod or node goes away. Real HA needs an operator (CloudNativePG, Zalando) and know how. |
| Scaling | Change the machine type or enable automatic storage increase. Read replicas are built in. | Edit resources and resize the PVC. Read replicas need an operator or manual streaming replication. |
| Monitoring | Metrics, logs and query insights in the Cloud Console out of the box. | We must add exporters (postgres_exporter) and dashboards. |
| Portability | Tied to Google Cloud. | The same manifests run in k3d, GKE or any other cluster. |

**Backups**

| | DBaaS | DIY |
|---|---|---|
| Method | Automated daily backups and point in time recovery with a checkbox. | We build them: a CronJob running `pg_dump` and uploading to object storage (exercise 3.10), or volume snapshots. |
| Restore | Restore to a new instance or a point in time from the console. | Download the dump and `psql` / `pg_restore` it manually. We must test this ourselves. |
| Ease | Very easy and reliable. | Flexible and cheap, but easy to forget or get wrong until the day it is needed. |

**Summary**: DBaaS costs more money but much less work, and backups, HA and upgrades are
basically solved. DIY is cheaper and portable, which is fine for a course project or
development environments, but for production data the operational work and risk of DIY
usually costs more than the DBaaS bill.

### 3.10

The CronJob `todo_backup` runs `pg_dump` once a day and uploads the gzipped dump to the
Google Cloud Storage bucket `dwk-todo-backups`. The service account key is created from the
command line and never stored in GitHub:

```
gcloud storage buckets create gs://dwk-todo-backups --location=europe-north1
gcloud iam service-accounts create my-storage-sa --display-name="Pod Storage SA"
gcloud projects add-iam-policy-binding PROJECT_ID --role=roles/storage.objectCreator \
  --member=serviceAccount:my-storage-sa@PROJECT_ID.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding PROJECT_ID --role=roles/storage.objectViewer \
  --member=serviceAccount:my-storage-sa@PROJECT_ID.iam.gserviceaccount.com
gcloud iam service-accounts keys create key.json \
  --iam-account=my-storage-sa@PROJECT_ID.iam.gserviceaccount.com
kubectl create secret generic storage-sa-key -n project --from-file=key.json=key.json
rm key.json

kubectl create job -n project --from=cronjob/todo-db-backup todo-db-backup-now   # test it
gcloud storage ls gs://dwk-todo-backups
```

### 3.11

Every container of the project has resource requests and limits. The Node apps idle at
around 30-40Mi of memory and almost no CPU, so they request little and are limited to
128Mi; Postgres and the backup job (gcloud CLI) get more memory.

| Container | CPU request / limit | Memory request / limit |
|---|---|---|
| todo-app | 10m / 200m | 48Mi / 128Mi |
| todo-backend | 10m / 200m | 48Mi / 128Mi |
| postgres | 25m / 500m | 64Mi / 256Mi |
| wikipedia-todo (CronJob) | 10m / 100m | 32Mi / 64Mi |
| backup (CronJob) | 50m / 500m | 128Mi / 256Mi |

```
kubectl top pods -n project
```
