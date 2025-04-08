import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/zero-app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/zero-app"!</div>
}
