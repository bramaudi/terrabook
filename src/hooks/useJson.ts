import { createResource, ResourceOptions, ResourceReturn } from 'solid-js'

/**
 * useJson
 * @param path /public/json/{path}
 * @returns 
 */
export default function<T extends unknown>(path: string):
ResourceReturn<T, ResourceOptions<T>> {
	const prefix = '/json/'
	const fetcher = (url: string) => fetch(url).then(r => r.json())
	return createResource(prefix + path, fetcher)
}