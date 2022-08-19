import { RouteDefinition } from "solid-app-router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
	{
		path: '/wiki/:type/*slug',
		component: lazy(() => import('@/pages/wiki'))
	},
	{
		path: '/',
		component: lazy(() => import('@/pages/index'))
	}
]

export default routes