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

router.afterEach((to) => {
  const title = to.meta?.title
  if (typeof title === 'string') {
    document.title = title
  }
})

export default router
