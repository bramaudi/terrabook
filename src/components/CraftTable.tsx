import { Crafts } from "@/types"
import { parseImg } from "@/utils"
import { For, Show } from "solid-js"

type Props = {
	title: string
	receipes: Crafts
}
export default function (props: Props) {
	return (
		<>
			<div class="mt-3 font-semibold">{props.title}</div>
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
											innerHTML={parseImg(result!.value)}
										></td>
									</Show>
									<Show when={ingredients}>
										<td
											class="box-wiki whitespace-nowrap p-2 py-1"
											rowSpan={ingredients!.rowspan}
											innerHTML={parseImg(ingredients!.value)}
										></td>
									</Show>
									<Show when={station}>
										<td
											class="box-wiki whitespace-nowrap p-2 py-1 text-center"
											rowSpan={station!.rowspan}
											innerHTML={parseImg(station!.value)}
										></td>
									</Show>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</div>
		</>
	)
} 