#!/bin/sh
# Istio in ambient mode on k3d, the Bookinfo sample app and Kiali (exercise 5.2).
# Follows https://istio.io/latest/docs/ambient/getting-started/
set -e
cd "$(dirname "$0")"

# Istio CLI
curl -L https://istio.io/downloadIstio | sh -
export PATH="$PWD/$(ls -d istio-*/ | head -n1)bin:$PATH"

# k3d needs the CNI paths of k3s
istioctl install --set profile=ambient --set values.global.platform=k3d --skip-confirmation

# Gateway API CRDs
kubectl get crd gateways.gateway.networking.k8s.io >/dev/null 2>&1 || \
  kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.3.0/standard-install.yaml

ISTIO_DIR=$(ls -d istio-*/ | head -n1)

# Sample app
kubectl apply -f "$ISTIO_DIR/samples/bookinfo/platform/kube/bookinfo.yaml"
kubectl apply -f "$ISTIO_DIR/samples/bookinfo/platform/kube/bookinfo-versions.yaml"
kubectl apply -f "$ISTIO_DIR/samples/bookinfo/gateway-api/bookinfo-gateway.yaml"
kubectl annotate gateway bookinfo-gateway networking.istio.io/service-type=ClusterIP --namespace=default
kubectl label namespace default istio.io/dataplane-mode=ambient

# Kiali, using the Prometheus of monitoring/install.sh
kubectl apply -f "$ISTIO_DIR/samples/addons/kiali.yaml"
kubectl apply -f kiali.yaml
kubectl rollout restart deployment/kiali -n istio-system

# Waypoint and traffic management of the getting started guide
istioctl waypoint apply --enroll-namespace --wait
kubectl apply -f "$ISTIO_DIR/samples/bookinfo/platform/kube/bookinfo-versions.yaml"
