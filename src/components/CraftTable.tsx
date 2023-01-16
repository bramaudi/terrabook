import useJson from "@/hooks/useJson"
import { Crafts } from "@/types"
import { parseImg } from "@/utils"
import { For, Show } from "solid-js"

type Props = {
	title: string
	receipes: Crafts
}
type CompleteItems = Array<{ type: string, name: string }>

export default function (props: Props) {
	const [completeItems] = useJson<CompleteItems>(`_search.json`)

	function parseLinkItem(text: string, dict: CompleteItems) {
		if (dict) {
			// sort longest name first
			dict.sort((a,b) => b.name.length - a.name.length)
			for (const item of dict) {
				const path = `/wiki/${item.type}/${item.name}`.replaceAll("'", "\\\'")
				text = text.replace(`<linked>${item.name}</linked>`, `<a href="#" onclick="window.location.href='${path}'">${item.name}</a> `)
			}
			return text
		}
	}
	
	return (
		<>
		<Show when={completeItems.loading}>
			<div class="mt-4 text-center font-semibold text-sm">Loading ...</div>
		</Show>
		<Show when={!completeItems.loading && !completeItems.error}>
			<div class="mt-3 font-semibold craft-title" innerHTML={parseImg(props.title)}></div>
			<div class="overflow-auto">
				<table class="box-wiki mt-2 w-full text-sm text-left">
					<thead>
						<tr class="bg-black bg-opacity-10">
							<th class="box-wiki p-2 py-1">Result</th>
							<th class="box-wiki p-2 py-1">Ingredients</th>
							<th class="box-wiki p-2 py-1 text-center">Crafting station</th>
						</tr>
					</thead>
					<tbody>
						<For each={props.receipes}>
							{({ result, ingredients, station }) => (
								<tr class="box-wiki last:border-none">
									<Show when={result}>
										<td
											class="box-wiki whitespace-nowrap p-2 py-1"
											rowSpan={result!.rowspan}
											innerHTML={
												parseLinkItem(
													parseImg(result!.value),
													completeItems()
												)
											}
										></td>
									</Show>
									<Show when={ingredients}>
										<td
											class="box-wiki whitespace-nowrap p-2 py-1"
											rowSpan={ingredients!.rowspan}
											innerHTML={
												parseLinkItem(
													parseImg(ingredients!.value),
													completeItems()
												)
											}
										></td>
									</Show>
									<Show when={station}>
										<td
											class="box-wiki whitespace-nowrap p-2 py-1 text-center"
											rowSpan={station!.rowspan}
											innerHTML={
												parseLinkItem(
													parseImg(station!.value),
													completeItems()
												)
											}
										></td>
									</Show>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</div>
		</Show>
		</>
	)
} 