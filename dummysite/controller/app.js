// Controller for DummySite resources. For every DummySite it downloads the page in
// spec.website_url and creates a ConfigMap with the HTML, an nginx Deployment serving it
// and a Service. The created resources are owned by the DummySite, so deleting the
// DummySite deletes them too.
const fs = require('fs')

const SA_DIR = '/var/run/secrets/kubernetes.io/serviceaccount'
const API = process.env.KUBERNETES_API || 'https://kubernetes.default.svc'
const TOKEN = process.env.KUBERNETES_TOKEN || fs.readFileSync(`${SA_DIR}/token`, 'utf8')
const RESYNC_MS = Number(process.env.RESYNC_SECONDS || 10) * 1000

const GROUP = 'stable.dwk'
const VERSION = 'v1'
const PLURAL = 'dummysites'

const k8s = async (method, path, body) => {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status} ${await response.text()}`)
  }
  return response.json()
}

// Creates the resource unless it exists already
const ensure = async (listPath, name, body) => {
  if (await k8s('GET', `${listPath}/${name}`)) return false
  await k8s('POST', listPath, body)
  return true
}

const fetchPage = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': 'dummysite-controller/1.0' } })
  if (!response.ok) throw new Error(`Fetching ${url} -> ${response.status}`)
  const html = await response.text()
  // A base element makes relative links, images and styles point to the original site
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${url}">`)
}

const reconcile = async (site) => {
  const { name, namespace, uid } = site.metadata
  const url = site.spec.website_url
  const labels = { app: `dummysite-${name}` }
  const ownerReferences = [{
    apiVersion: `${GROUP}/${VERSION}`,
    kind: 'DummySite',
    name,
    uid,
    controller: true,
    blockOwnerDeletion: true,
  }]
  const metadata = (resourceName) => ({ name: resourceName, namespace, labels, ownerReferences })
  const resourceName = `dummysite-${name}`

  const configMapPath = `/api/v1/namespaces/${namespace}/configmaps`
  if (!(await k8s('GET', `${configMapPath}/${resourceName}`))) {
    const html = await fetchPage(url)
    await k8s('POST', configMapPath, {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: metadata(resourceName),
      data: { 'index.html': html },
    })
    console.log(`Created ConfigMap ${namespace}/${resourceName} from ${url}`)
  }

  const created = await ensure(`/apis/apps/v1/namespaces/${namespace}/deployments`, resourceName, {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: metadata(resourceName),
    spec: {
      replicas: 1,
      selector: { matchLabels: labels },
      template: {
        metadata: { labels },
        spec: {
          volumes: [{ name: 'html', configMap: { name: resourceName } }],
          containers: [{
            name: 'nginx',
            image: 'nginx:1.27-alpine',
            ports: [{ containerPort: 80 }],
            volumeMounts: [{ name: 'html', mountPath: '/usr/share/nginx/html' }],
          }],
        },
      },
    },
  })
  if (created) console.log(`Created Deployment ${namespace}/${resourceName}`)

  if (await ensure(`/api/v1/namespaces/${namespace}/services`, resourceName, {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: metadata(resourceName),
    spec: {
      selector: labels,
      ports: [{ port: 80, targetPort: 80 }],
    },
  })) console.log(`Created Service ${namespace}/${resourceName}`)
}

const resync = async () => {
  try {
    const list = await k8s('GET', `/apis/${GROUP}/${VERSION}/${PLURAL}`)
    for (const site of list.items) {
      try {
        await reconcile(site)
      } catch (error) {
        console.error(`Could not reconcile ${site.metadata.namespace}/${site.metadata.name}:`, error.message)
      }
    }
  } catch (error) {
    console.error('Could not list DummySites:', error.message)
  }
  setTimeout(resync, RESYNC_MS)
}

console.log('DummySite controller started')
resync()
