import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
	{
		path: '/wiki/:type/*slug',
		component: lazy(() => import('@/pages/wiki'))
	},
	{
		path: '/search/*path',
		component: lazy(() => import('@/pages/search'))
	},
	{
		path: '/favorite/*path',
		component: lazy(() => import('@/pages/favorite'))
	},
	{
		path: '/',
		component: lazy(() => import('@/pages/index'))
	}
]

export default routes