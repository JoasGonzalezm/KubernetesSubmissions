#!/bin/sh
# Knative Serving with Kourier and sslip.io DNS on k3d (exercise 5.6)
set -e
VERSION=knative-v1.20.0

# k3d cluster without Traefik, Kubernetes 1.34 is required by the latest Knative
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 \
  --k3s-arg "--disable=traefik@server:0" --image rancher/k3s:v1.34.1-k3s1

kubectl apply -f https://github.com/knative/serving/releases/download/$VERSION/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/$VERSION/serving-core.yaml

# Networking layer: Kourier
kubectl apply -f https://github.com/knative/net-kourier/releases/download/$VERSION/kourier.yaml
kubectl patch configmap/config-network --namespace knative-serving --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

# Magic DNS (sslip.io)
kubectl apply -f https://github.com/knative/serving/releases/download/$VERSION/serving-default-domain.yaml

kubectl get pods -n knative-serving
