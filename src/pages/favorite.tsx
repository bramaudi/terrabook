import { Result } from "@/types"
import { Link, useLocation } from "solid-app-router"
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js"
import Wiki from "@/components/Wiki"
import useFavorite from "@/hooks/useFavorite"

type Results = Array<Result>

export default function() {
	const location = useLocation()
    const [items, { toggleFavorite }] = useFavorite()
	const [search, setSearch] = createSignal('')
	const [limit, setLimit] = createSignal(0)

	const path = () => location.pathname.split('/').slice(-1)[0]
    const indexView = (): boolean => {
		const path = location.pathname.split('/').slice(2)
		return path.length !== 2
	}

    const filteredList = createMemo(() => {
		const max = 30
		const start = max * limit()
		const end = start + max

		return (items() || [])
			.filter(item => item.name.match(new RegExp(search(), 'i')) )
			.slice(0,end)
	})	

	let timeout: NodeJS.Timeout
	function handleSearch(e: InputEvent) {
		clearTimeout(timeout)
		const value = (e.currentTarget as HTMLInputElement).value
		timeout = setTimeout(() => {
			setSearch(value)
		}, 300)
	}

	function handleWindowScroll() {
		// For smooth infinite scroll, append items 80% before bottom treshold
		const percent = 80
		const transition = (percent/100) * window.innerHeight
		if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - transition)) {
			if (filteredList().length <= items()?.length) {
				setLimit(limit() + 1)
			}
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
						onInput={handleSearch}
						type="text"
					/>
				</div>
				<For each={filteredList()}>
					{(item) => {
						const slug = item.name.replace(/ /g, '_')
						return (
							<div class="flex items-center my-1">
								<img
									class="inline mr-2 max-h-8"
									style={{ "max-width": '32px' }}
									src={`/images/${item.type === 'bosses' ? 'Map_Icon_': ''}${slug}.webp`}
								/>
								<Link href={`/search/${item.type}/${item.name}`}>{decodeURIComponent(item.name)}</Link>
								<button
									class="ml-auto"
									onClick={() => toggleFavorite(item)}
								>
									<svg class="w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"></path></svg>
								</button>
							</div>
						)
					}}
				</For>
				<Show when={filteredList().length > 50 && filteredList().length >= items()?.length}>
					<div class="relative flex items-center">
						<div class="flex-grow border-t border-white border-opacity-20"></div>
						<span class="flex-shrink mx-4 text-xs text-gray-200">End of list</span>
						<div class="flex-grow border-t border-white border-opacity-20"></div>
					</div>
				</Show>
			</div>
		</>
	)
}