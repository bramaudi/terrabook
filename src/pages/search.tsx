import { Link, useLocation, useParams } from "solid-app-router"
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js"
import useJson from "@/hooks/useJson"
import Wiki from "@/components/Wiki"

export default function() {
	const location = useLocation()
    const [items] = useJson<Array<{ type: string, name: string }>>('_search.json')
    const [search, setSearch] = createSignal('')
	const [limit, setLimit] = createSignal(0)

	const path = () => location.pathname.split('/').slice(-1)[0]
    const indexView = (): boolean => {
		const path = location.pathname.split('/').slice(2)
		return path.length !== 2
	}

    const filteredItems = createMemo(() => {
		const max = 50
		const start = max * limit()
		const end = start + max

		let list = items()?.slice(0,end)
		if (search().length) {
			list = items()
		}
		
		return list?.filter((item: { type: string, name: string }) => {
			return item.name.match(new RegExp(search(), 'i'))
		})
	}, [])

	function handleWindowScroll() {
		// For smooth infinite scroll, append items 80% before bottom treshold
		const percent = 80
		const transition = (percent/100) * window.innerHeight
		if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - transition)) {
			setLimit(limit() + 1)
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleWindowScroll)
	})
	onCleanup(() => {
		window.removeEventListener('scroll', handleWindowScroll)
	})
	
    return (
		<>
			<div
				class="fixed w-full top-0 pb-16 h-screen overflow-auto p-4"
				classList={{ 'hidden': !!indexView() }}
			>
				<Show when={!indexView()}>
					<Wiki slug={path()} />
				</Show>
			</div>
			<div
				class="p-4"
				classList={{ 'hidden': !indexView() }}
			>
				<div class="sticky top-2">
					<input
						class="w-full p-2 mb-2 rounded bg-slate-900 text-slate-100 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
						placeholder="Search"
						value={search()}
						onInput={e => setSearch(e.currentTarget.value)}
						type="text"
					/>
				</div>
				<For each={filteredItems()}>
					{(item) => {
						const slug = item.name.replace(/ /g, '_')
						return (
							<div class="my-1">
								<img
									class="inline mr-2 max-h-8"
									style={{ "max-width": '32px' }}
									src={`/images/${item.type === 'bosses' ? 'Map_Icon_': ''}${slug}.webp`}
								/>
								<Link href={`/search/${item.type}/${item.name}`}>{decodeURIComponent(item.name)}</Link>
							</div>
						)
					}}
				</For>
			</div>
		</>
	)
}