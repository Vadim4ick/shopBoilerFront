import { createEvent, createStore } from 'effector'

export const setBreadcrumbName = createEvent<string | null>()
export const $breadcrumbName = createStore<string | null>(null)

$breadcrumbName.on(setBreadcrumbName, (_, breadcrumb) => breadcrumb)
