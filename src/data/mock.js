// Mirrors relational backend records; replace the service functions, not the UI.
export const categories = [
  { id: '71d63e9c-2238-45a2-84ec-61601282a111', slug: 'spaces', name: 'Spaces', created_at: '2025-01-08T10:00:00.000Z' },
  { id: '71d63e9c-2238-45a2-84ec-61601282a112', slug: 'objects', name: 'Objects', created_at: '2025-01-08T10:00:00.000Z' },
  { id: '71d63e9c-2238-45a2-84ec-61601282a113', slug: 'editorial', name: 'Editorial', created_at: '2025-01-08T10:00:00.000Z' },
]

export const projects = [
  {
    id: 'ee4bc2cb-7cdf-4b89-bc07-78956426a101',
    category_id: categories[0].id,
    title: 'A house for the horizon',
    client: 'Casa Solenne',
    location: 'Mallorca, Spain',
    year: '2025',
    number: '01',
    image_url: '/images/project-01.jpg',
    image_alt: 'Sculptural travertine residence overlooking the Mediterranean at sunset',
    image_width: 1264,
    image_height: 848,
    description: 'A quiet architectural identity for a place built to make you pause. We found its story in the dialogue between stone, sunlight and the sea.',
    disciplines: ['Art direction', 'Visual identity', 'Digital experience'],
    created_at: '2025-02-12T09:00:00.000Z',
  },
  {
    id: 'ee4bc2cb-7cdf-4b89-bc07-78956426a102',
    category_id: categories[1].id,
    title: 'The art of less',
    client: 'Forma No. 01',
    location: 'Copenhagen, Denmark',
    year: '2025',
    number: '02',
    image_url: '/images/project-02.jpg',
    image_alt: 'Minimal black vessel and ivory sculptural object on a sunlit stone plinth',
    image_width: 1264,
    image_height: 848,
    description: 'An object collection shaped by restraint. A considered visual world where material, silhouette and shadow do all the talking.',
    disciplines: ['Brand strategy', 'Art direction', 'Campaign'],
    created_at: '2025-05-21T09:00:00.000Z',
  },
  {
    id: 'ee4bc2cb-7cdf-4b89-bc07-78956426a103',
    category_id: categories[2].id,
    title: 'Beyond the familiar',
    client: 'Elsewhere Journal',
    location: 'Worldwide',
    year: '2026',
    number: '03',
    image_url: '/images/project-03.jpg',
    image_alt: 'Figure in flowing ivory fabric walking past a monumental rust-red desert wall',
    image_width: 1264,
    image_height: 848,
    description: 'An editorial universe for the curious. A study of how far the imagination can travel when the familiar falls away.',
    disciplines: ['Editorial direction', 'Photography', 'Digital'],
    created_at: '2026-01-15T09:00:00.000Z',
  },
]

const wait = (ms, signal) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve() }, ms)
  function onAbort() { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')) }
  if (signal?.aborted) onAbort()
  else signal?.addEventListener('abort', onAbort, { once: true })
})

// Swap these two functions for Supabase/Firebase/fetch without touching components.
export async function fetchProjects({ signal, attempt = 0 } = {}) {
  await wait(680, signal)
  if (new URLSearchParams(window.location.search).has('simulateError') && attempt === 0) {
    throw new Error('The archive is taking a moment to wake up.')
  }
  return projects.map((project) => ({ ...project }))
}

export async function createInquiry(payload) {
  await wait(1050)
  if (new URLSearchParams(window.location.search).has('simulateContactError')) {
    throw new Error('Unable to send right now. Please try again shortly.')
  }
  // Backend replacement: POST this row to the inquiries table. Never expose service secrets client-side.
  return {
    id: globalThis.crypto?.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
      const random = Math.floor(Math.random() * 16)
      return (character === 'x' ? random : (random & 3) | 8).toString(16)
    }),
    name: payload.name,
    email: payload.email,
    message: payload.message,
    created_at: new Date().toISOString(),
  }
}
