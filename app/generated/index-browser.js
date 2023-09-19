exports.Routes = {
  AdminIndexPage: (query) => ({ pathname: "/admin", query }),
  AdminProductDetailPage: (query) => ({ pathname: "/admin/products/[id]", query }),
  AdminCreateProductPage: (query) => ({ pathname: "/admin/products/create", query }),
  AdminProductsPage: (query) => ({ pathname: "/admin/products", query }),
  DashboardPage: (query) => ({ pathname: "/demo", query }),
  IndexPage: (query) => ({ pathname: "/", query }),
  ProductDetailPage: (query) => ({ pathname: "/products/[id]", query })
}