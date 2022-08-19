import { NAV, NAV_ICONS } from "@/consts";
import { Link, useLocation } from "solid-app-router";
import { For } from "solid-js";

export default function() {
    const location = useLocation()

    return (
        <nav
            style={{ background: '#473730' }}
            class="fixed bottom-0 w-full max-w-2xl flex items-center justify-center"
        >
            <For each={NAV}>
                {({ url, name }, index) => (
                    <Link
                        class="flex-1 flex flex-col items-center p-2 hover:bg-black hover:bg-opacity-10"
                        href={url}
                        classList={{ 'bg-black bg-opacity-20': location.pathname === url }}
                    >
                        <svg class="w-5" viewBox="0 0 24 24" innerHTML={NAV_ICONS[index()]}></svg>
                        <span class="text-xs">{name}</span>
                    </Link>
                )}
            </For>
        </nav>
    )
}