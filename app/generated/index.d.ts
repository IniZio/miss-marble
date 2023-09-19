import type { ParsedUrlQueryInput } from "querystring"
import type { RouteUrlObject } from "next/types"

export const Routes: {
  AdminIndexPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  AdminProductDetailPage(query: { id: string | number } & ParsedUrlQueryInput): RouteUrlObject;
  AdminCreateProductPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  AdminProductsPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  DashboardPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  IndexPage(query?: ParsedUrlQueryInput): RouteUrlObject;
  ProductDetailPage(query: { id: string | number } & ParsedUrlQueryInput): RouteUrlObject;
}