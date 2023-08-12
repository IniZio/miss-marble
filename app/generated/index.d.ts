import type { ParsedUrlQueryInput } from "querystring"
import type { RouteUrlObject } from "next/types"

export const Routes: {
  DashboardPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  IndexPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  ProductDetailPage(query: { id: string | number } & ParsedUrlQueryInput): RouteUrlObject;
}