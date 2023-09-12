import { MENUS } from "@/consts"
import { App } from "@capacitor/app"
import { Toast } from "@capacitor/toast"
import { Link } from "@solidjs/router"
import { For, onCleanup, onMount } from "solid-js"

export default function() {
	onMount(() => {
		let backPressed = 0
		App.addListener('backButton', async () => {
			backPressed++
			if (backPressed === 2) {
				App.exitApp()
			}
			if (backPressed === 1) {
				await Toast.show({ text: 'Tap again to exit' })
			}
			setTimeout(() => {
				backPressed = 0
			}, 2000)
		})
	})
	onCleanup(() => {
		App.removeAllListeners()
	})

	return (
		<>
			<For each={MENUS}>{({ slug, icon }) => (
				<Link href={`/wiki/${slug}`} class="block box-wiki m-2 p-2">
					<img class="w-5 mr-1 inline" src={`/images/${icon}.webp`} />
					{slug.charAt(0).toUpperCase() + slug.slice(1)}
				</Link>
			)}</For>
			<Link href="#" class="block box-wiki m-2 p-2"
				onClick={() => App.exitApp()}
			>
				<img class="w-5 inline" src="/images/Painted_Arrow_Sign.webp" /> Exit
			</Link>
		</>
	)
}