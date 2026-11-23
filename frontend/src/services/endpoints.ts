export const ENDPOINTS = {
  auth: { login: "auth/login", register: "auth/register", me: "auth/me" },

  products: {
    list: "/products",
    byId: (id: number | string) => `/products/${id}`,
    mine: "/products/mine",
    status: (id: number | string) => `/products/${id}/status`,
    stock: (id: number | string) => `/products/${id}/stock`,
    reviews: (id: number | string) => `/products/${id}/reviews`,
  },

  artisans: {
    list: "/artisans",
    byId: (id: number | string) => `/artisans/${id}`,
    myProfile: "/artisans/profile",
    orders: "/artisans/orders",
    myProducts: (id: number | string) => `/artisans/${id}/products`,
    orderById: (id: number | string) => `/artisan/orders/${id}`,
  },

  orders: {
    create: "/orders",
    mine: "/orders/me",
    artisan: "/artisan/orders",
    byId: (id: number | string) => `/orders/${id}`,
    cancel: (id: number | string) => `/orders/${id}/cancel`,
    pack: (id: number | string) => `/orders/${id}/pack`,
    status: (id: number | string) => `/orders/${id}/status`,
  },

  admin: {
    metrics: "/admin/metrics",
    orders: "/admin/orders",
    users: "/users",
    userActive: (id: number | string) => `/admin/users/${id}/active`,
    products: "/admin/products",
    productModeration: (id: number | string) =>
      `/admin/products/${id}/moderation`,
    artisans: "/admin/artisans",
    artisanModeration: (id: number | string) =>
      `/admin/artisans/${id}/moderation`,
  },

  users: {
    userById: (id: number | string) => `/users/${id}/`,
  },

  recommendations: "/recommendations",
  events: "/events",
} as const;
