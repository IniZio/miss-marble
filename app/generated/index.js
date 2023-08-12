exports.Routes = {
  DashboardPage: (query) => ({ pathname: "/demo", query }),
  IndexPage: (query) => ({ pathname: "/", query }),
  ProductDetailPage: (query) => ({ pathname: "/products/[id]", query })
}