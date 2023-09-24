exports.Routes = {
  AdminIndexPage: (query) => ({ pathname: "/admin", query }),
  AdminProductFieldDetailPage: (query) => ({ pathname: "/admin/product-fields/[id]", query }),
  AdminCreateProductFieldPage: (query) => ({ pathname: "/admin/product-fields/create", query }),
  AdminProductFieldListPage: (query) => ({ pathname: "/admin/product-fields", query }),
  AdminProductDetailPage: (query) => ({ pathname: "/admin/products/[id]", query }),
  AdminCreateProductPage: (query) => ({ pathname: "/admin/products/create", query }),
  AdminProductsPage: (query) => ({ pathname: "/admin/products", query }),
  DashboardPage: (query) => ({ pathname: "/demo", query }),
  IndexPage: (query) => ({ pathname: "/", query }),
  PosHomePage: (query) => ({ pathname: "/pos", query }),
  ProductDetailPage: (query) => ({ pathname: "/products/[id]", query })
}