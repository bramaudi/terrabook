import { Result } from "@/types"
import { Accessor, createEffect, createSignal, onMount } from "solid-js";

type Return = [Accessor<Array<Result>>, {
    toggleFavorite: (data: Result) => void;
    isFavorite: (data: Result) => boolean;
}]

export default function(): Return {
    const [list, setList] = createSignal<Array<Result>>([])

    function isFavorite(data: Result) {
        return !!list()
            .filter(item => JSON.stringify(item) === JSON.stringify(data))
            .length
    }
    function toggleFavorite(data: Result) {
        setList(
            isFavorite(data)
                ? list().filter(item => JSON.stringify(item) !== JSON.stringify(data))
                : [...list(), data]
        )
    }

    onMount(() => {
        setList(JSON.parse(localStorage.getItem('favorite') || '[]'))
    })
    createEffect(() => {
        localStorage.setItem('favorite', JSON.stringify(list()))
    })

    return [list, { toggleFavorite, isFavorite }]
}