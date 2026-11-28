import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MediaView from '@/views/MediaView.vue'
// Gene - Nov, 19, 2026: Register empty-state SPIN Jobs route
// import JobsView from '@/views/JobsView.vue'
// Gene - Nov, 23, 2026: Register unified InitiativesView (PSEPRI, SPIN Jobs, Awards & Chapter Programs)
import InitiativesView from '@/views/InitiativesView.vue'
// Gene - Nov, 19, 2026: Register empty-state Gallery and Key Leaders Directory views
import GalleryView from '@/views/GalleryView.vue'
import KeyLeadersView from '@/views/KeyLeadersView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
// Gene - Nov, 28, 2026: Import admin auth guard helper for hidden /admin routes
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home | SPIN Media TV Philippines' },
    },
    {
      path: '/media',
      name: 'media',
      component: MediaView,
      meta: { title: 'Media Hub | SPIN Media TV Philippines' },
    },
    // Gene - Nov, 19, 2026: Add Gallery and Key Leaders Directory routes
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView,
      meta: { title: 'Gallery | SPIN Media TV Philippines' },
    },
    {
      path: '/leaders',
      name: 'leaders',
      component: KeyLeadersView,
      meta: { title: 'Key Leaders Directory | SPIN Media TV Philippines' },
    },
    /*
    // Gene - Nov, 19, 2026: Add SPIN Jobs page route
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView,
      meta: { title: 'SPIN Jobs | SPIN Media TV Philippines' },
    },
    */
    // Gene - Nov, 23, 2026: Add unified SPIN Initiatives route and preserve /jobs via redirect
    {
      path: '/initiatives',
      name: 'initiatives',
      component: InitiativesView,
      meta: { title: 'Initiatives & Programs | SPIN Media TV Philippines' },
    },
    {
      path: '/jobs',
      redirect: { path: '/initiatives', hash: '#spin-jobs' },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { title: 'About Us | SPIN Media TV Philippines' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { title: 'Contact Us | SPIN Media TV Philippines' },
    },
    // Gene - Nov, 28, 2026: Hidden lazy-loaded /admin login & console routes (never linked in public nav)
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: {
        title: 'Admin Sign In | SPIN Media TV Philippines',
        layout: 'admin',
        guestOnly: true,
      },
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'admin-live',
          component: () => import('@/views/admin/AdminLivePanel.vue'),
          meta: { title: 'Live Broadcast Control | SPIN Admin', layout: 'admin', requiresAuth: true },
        },
        /*
        {
          path: 'site',
          name: 'admin-site',
          component: () => import('@/views/admin/AdminSitePanel.vue'),
          meta: { title: 'Site & URLs | SPIN Admin', layout: 'admin', requiresAuth: true },
        },
        */
        // Gene - Nov, 28, 2026: Gate /admin/site to admin+ and add super_admin-only /admin/users route
        {
          path: 'site',
          name: 'admin-site',
          component: () => import('@/views/admin/AdminSitePanel.vue'),
          meta: {
            title: 'Site & URLs | SPIN Admin',
            layout: 'admin',
            requiresAuth: true,
            requiresAdminOrAbove: true,
          },
        },
        {
          path: 'media',
          name: 'admin-media',
          component: () => import('@/views/admin/AdminMediaPanel.vue'),
          meta: { title: 'Media Hub Manager | SPIN Admin', layout: 'admin', requiresAuth: true },
        },
        {
          path: 'shows',
          name: 'admin-shows',
          component: () => import('@/views/admin/AdminShowsPanel.vue'),
          meta: { title: 'Weekly Shows Manager | SPIN Admin', layout: 'admin', requiresAuth: true },
        },
        {
          path: 'content',
          name: 'admin-content',
          component: () => import('@/views/admin/AdminContentPanel.vue'),
          meta: { title: 'News, Leaders & CMS | SPIN Admin', layout: 'admin', requiresAuth: true },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/AdminUsersPanel.vue'),
          meta: {
            title: 'Users & Roles | SPIN Admin',
            layout: 'admin',
            requiresAuth: true,
            requiresSuperAdmin: true,
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

/*
router.afterEach((to) => {
  const title = to.meta?.title
  if (typeof title === 'string') {
    document.title = title
  }
})
*/
/*
// Gene - Nov, 28, 2026: Auth guard exclusively for /admin routes + noindex robots meta management
router.beforeEach(async (to) => {
  const needsAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta?.guestOnly)
  if (!needsAuth && !guestOnly) return true

  const { initAdminAuth, isAdmin } = useAdminAuth()
  await initAdminAuth()

  if (needsAuth && !isAdmin.value) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
  if (guestOnly && isAdmin.value) {
    return { path: '/admin' }
  }
  return true
})
*/
// Gene - Nov, 28, 2026: Enforce role checks (super_admin for /admin/users, admin+ for /admin/site)
router.beforeEach(async (to) => {
  const needsAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta?.guestOnly)
  if (!needsAuth && !guestOnly) return true

  const { initAdminAuth, isAdmin, isSuperAdmin, canManageSite } = useAdminAuth()
  await initAdminAuth()

  if (needsAuth && !isAdmin.value) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
  if (guestOnly && isAdmin.value) {
    return { path: '/admin' }
  }
  if (to.matched.some((record) => record.meta?.requiresSuperAdmin) && !isSuperAdmin.value) {
    return { path: '/admin' }
  }
  if (to.matched.some((record) => record.meta?.requiresAdminOrAbove) && !canManageSite.value) {
    return { path: '/admin' }
  }
  return true
})

router.afterEach((to) => {
  const title = to.meta?.title
  if (typeof title === 'string') {
    document.title = title
  }

  const isAdmin = to.matched.some((record) => record.meta?.layout === 'admin')
  const existingRobots = document.querySelector('meta[name="robots"]')
  if (isAdmin) {
    if (existingRobots) {
      existingRobots.setAttribute('content', 'noindex, nofollow')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'robots'
      meta.content = 'noindex, nofollow'
      meta.setAttribute('data-spin-admin-robots', 'true')
      document.head.appendChild(meta)
    }
  } else if (existingRobots?.getAttribute('data-spin-admin-robots') === 'true') {
    existingRobots.remove()
  }
})

export default router
