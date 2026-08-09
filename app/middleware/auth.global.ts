export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('adminAccessToken')
  
  const publicPaths = ['/login', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.includes(to.path)
  
  if (!token.value && !isPublicPath) {
    return navigateTo('/login')
  }

  if (token.value && isPublicPath) {
    return navigateTo('/dashboard')
  }
})
