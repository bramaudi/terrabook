import { Link, useLocation } from "solid-app-router"
import { Accessor, createMemo, createSignal, For, onCleanup, onMount, Show, Signal } from "solid-js"
import Wiki from "./Wiki"

type Props = {
    items: Accessor<string[]>
    slug: string
}

export default function(props: Props) {
	const location = useLocation()
    const [search, setSearch] = createSignal('')
	const [limit, setLimit] = createSignal(0)

    const path = () => location.pathname.split('/').slice(-1)[0]
    const indexView = () => path() === props.slug

    const filteredItems = createMemo(() => {
		const max = 50
		const start = max * limit()
		const end = start + max

		let list = props.items()?.slice(0,end)
		if (search().length) {
			list = props.items()
		}
		
		return list?.filter((item: string) => {
			return item.match(new RegExp(search(), 'i'))
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
				class="fixed w-full h-screen overflow-auto p-4"
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
					{(item: string) => {
						const slug = item.replace(/ /g, '_')
						return (
							<div class="my-1">
								<img
									class="inline mr-2 max-h-8"
									style={{ "max-width": '32px' }}
									src={`/images/${props.slug === 'bosses' ? 'Map_Icon_': ''}${slug}.webp`}
								/>
								<Link href={`/wiki/${props.slug}/${item}`}>{decodeURIComponent(item)}</Link>
							</div>
						)
					}}
				</For>
			</div>
		</>
	)
}