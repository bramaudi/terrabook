import { Base, Bosses, Hooks, NPC, Tools } from "@/types"
import { createSignal, For, Show } from "solid-js"
import { Browser } from "@capacitor/browser"
import { parseImg } from "@/utils"
import useJson from "@/hooks/useJson"
import CraftTable from "@/components/CraftTable"
import useFavorite from "@/hooks/useFavorite"

const MODE: { [key:number]: string } = { 0: 'Classic', 1: 'Expert', 2: 'Master' }

export default function(props: { slug: string }) {
	const { slug } = props
	const [items] = useJson<Base>(`${slug}.json`)
	const [favorite, { toggleFavorite, isFavorite }] = useFavorite()
	// Exclusive on bosses display
	const [mode, setMode] = createSignal(0) // [normal,expert,master]
	
	const fav = () => {
		const name = ['pets', 'mounts'].includes(items()?.type) ? items()?.title : props.slug
		return { type: items().type, name }
	}
	const previewImage = () => {
		const name = ['pets', 'mounts'].includes(items()?.type) ? items()?.title : props.slug		
		return name.replace(/ /g, '_').replace('\\\'', "'")
	}
	
	return (
		<div
			class="max-w-2xl overflow-x-hidden"
			classList={{
				'show-normal': mode() === 0,
				'show-expert': mode() === 1,
				'show-master': mode() === 2,
			}}
		>
			<Show when={!items.error && !items.loading}>
				<div class="flex items-center">
					<div class="text-2xl font-bold mb-2">{items().title.replace('\\\'', "'")}</div>
					<button
						class="bg-black bg-opacity-20 rounded-md p-2 mb-1 ml-auto"
						onClick={async () => await Browser.open({ url: `https://terraria.wiki.gg/wiki/${name}` })}
					>
						<svg class="w-6" viewBox="0 0 24 24"><path fill="currentColor" d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.22.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"></path></svg>
					</button>
					<button
						class="bg-black bg-opacity-20 rounded-md p-2 mb-1 ml-2"
						onClick={() => toggleFavorite(fav())}
					>
						<svg
							classList={{ 'text-red-500': isFavorite(fav()) }}
							class="w-6" viewBox="0 0 24 24"><path fill="currentColor" d="m10.65 19.8l-1.725-1.575q-2.65-2.425-4.787-4.813Q2 11.025 2 8.15Q2 5.8 3.575 4.225Q5.15 2.65 7.5 2.65q1.325 0 2.5.562q1.175.563 2 1.538q.825-.975 2-1.538q1.175-.562 2.5-.562q2.35 0 3.925 1.575Q22 5.8 22 8.15q0 2.875-2.125 5.275q-2.125 2.4-4.825 4.825l-1.7 1.55q-.575.525-1.35.525q-.775 0-1.35-.525Z"></path></svg>
					</button>
				</div>
				<Show when={items().type === 'bosses'}>
					<div class="flex mb-1 rounded-md border border-black border-opacity-40">
					<For each={[0,1,2]}>
						{i => (
							<button
								class="flex-1 py-1"
								style={{ background: i === mode() ? '#44322a' : '#5a433a' }}
								onClick={() => setMode(i)}
							>{MODE[i]}</button>
						)}
					</For>
					</div>
				</Show>

				{/* Stats */}
				<div class="box-wiki p-2">
					<table class="table-fixed w-full my-2">
						<caption class="m-2">
							<img
								class="block mx-auto"
								classList={{'max-w-12 max-h-10': items().type !== 'bosses'}}
								style={{'image-rendering': 'pixelated'}}
								src={`/images/${previewImage()}.webp`}
							/>
							{/* Toolpower */}
							<Show when={items().type === 'tools'}>
								<ul class="toolpower mt-3 flex justify-center">
								<For each={(items() as Tools).toolpower!}>
									{power => (
										<li innerHTML={parseImg(power)}></li>
									)}
								</For>
								</ul>
							</Show>
						</caption>
						<For each={Object.keys(items().statistics)}>
							{key => (
								<tr class="table-row px-2 border-b border-dashed border-white border-opacity-10">
									<td class="font-semibold w-1/2 text-right pr-2">{key}</td>
									<td class="w-1/2" innerHTML={parseImg(items().statistics[key])}></td>
								</tr>
							)}
						</For>
						<Show when={['pets','mounts'].includes(items().type)}>
							<tr class="table-row px-2 border-b border-dashed border-white border-opacity-10">
								<td class="align-baseline font-semibold w-1/2 text-right pr-2">Summon</td>
								<td class="w-1/2">
									<div>{slug}</div>
									<img class="mt-2"
										src={`/images/${slug.replace(/ /g, '_')}.webp`}
										alt={slug}
									/>
								</td>
							</tr>
						</Show>
					</table>
				</div>

				{/* Summaries */}
				<Show when={items().summaries?.length}>
					<hr />
					<For each={items().summaries}>
						{html => <div class="my-3" innerHTML={parseImg(html)}></div>}
					</For>
				</Show>

				{/* Source & Notes */}
				<Show when={['hooks','fishing_poles','wings'].includes(items().type)}>
					<div class="mt-3 text-xl font-semibold text-white">Source:</div>
					<p class="mb-3" innerHTML={parseImg((items() as Hooks).source!)}></p>
					
					<Show when={(items() as Hooks).notes?.length}>
						<div class="mt-3 font-semibold">Notes:</div>
						<p class="mb-3" innerHTML={parseImg((items() as Hooks).notes!)}></p>
					</Show>
				</Show>


				{/* Crafts */}
				<Show when={items().receipes?.length}>
					<CraftTable
						title="Receipes:"
						receipes={items().receipes!}
					/>
				</Show>
				<Show when={items().used_in?.length}>
					<CraftTable
						title="Used in:"
						receipes={items().used_in!}
					/>
				</Show>
				
				{/* NPCs Living Preferences */}
				<Show when={(items() as NPC)?.living_preferences}>
					<div class="mt-3 text-xl font-semibold text-white">Living Preferences</div>
					<div class="overflow-auto">
						<table
							class="box-wiki mt-2 w-full text-sm text-left living-preferences"
							innerHTML={parseImg((items() as NPC).living_preferences!)}
						></table>
					</div>
				</Show>

				{/* Boss summoning */}
				<Show when={items().type === 'bosses' && (items() as Bosses)?.summon}>
					<div class="mt-3 text-xl font-semibold text-white">Summoning</div>
					<For each={(items() as Bosses).summon}>
						{html => <div class="my-3" innerHTML={parseImg(html)}></div>}
					</For>
				</Show>

				{/* NPC & Boss Drops */}
				<Show when={(items() as NPC)?.drops}>
					<div class="mt-3 text-xl font-semibold text-white">Drops</div>
					<Show when={items().type === 'bosses'}>
						<div class="flex mt-3 -mb-2 rounded-md border border-black border-opacity-40">
						<For each={[0,1,2]}>
							{i => (
								<button
									class="flex-1 py-1"
									style={{ background: i === mode() ? '#44322a' : '#5a433a' }}
									onClick={() => setMode(i)}
								>{MODE[i]}</button>
							)}
						</For>
						</div>
					</Show>
					<div
						class="mt-3 box-wiki"
						innerHTML={parseImg((items() as NPC).drops!)}
					></div>
				</Show>
			</Show>
		</div>
	)
}