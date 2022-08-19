import ScrollVew from "@/components/ScrollVew"
import useJson from "@/hooks/useJson"
import { useParams } from "solid-app-router"

export default function() {	
	const params = useParams<{
		type: string
		slug?: string
	}>()
	const [items] = useJson<string[]>(`_${params.type}.json`)
	
	return <ScrollVew items={items} slug={params.type} />
}