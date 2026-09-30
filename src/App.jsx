import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, Plus, X } from 'lucide-react'
import { categories } from './data/mock'
import { useProjects } from './hooks/useProjects'
import { useInquiry } from './hooks/useInquiry'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './components/ui/dialog'
import { Input } from './components/ui/input'

gsap.registerPlugin(ScrollTrigger)
const prefersLessMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const label = 'text-[10px] font-semibold uppercase tracking-[0.22em]'

function Magnetic({ children, className = '' }) {
  const ref = useRef(null)
  const move = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches || prefersLessMotion()) return
    const rect = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (event.clientX - rect.left - rect.width / 2) * .12, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .35, ease: 'power2.out', overwrite: true })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: .5, ease: 'power3.out', overwrite: true })
  return <span ref={ref} onPointerMove={move} onPointerLeave={leave} className={`inline-flex ${className}`}>{children}</span>
}

function Header({ onContact }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!menuOpen) return undefined
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [menuOpen])
  const links = [['Work', '#work'], ['Studio', '#studio'], ['Approach', '#approach']]
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 text-paper ${scrolled || menuOpen ? 'bg-ink/95' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-9 lg:px-14">
          <a href="#top" aria-label="Atelier Void, back to top" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-acid">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-paper/80"><span className="absolute h-[1px] w-7 -rotate-45 bg-paper"/><span className="h-2 w-2 rounded-full bg-acid" /></span>
            <span className="text-[12px] font-semibold uppercase leading-[1.08] tracking-[.17em]">Atelier<br />Void<span className="text-acid">.</span></span>
          </a>
          <nav className="hidden items-center gap-10 lg:flex" aria-label="Main navigation">
            {links.map(([text, href]) => <a key={text} href={href} className="group relative text-[11px] font-medium uppercase tracking-[.18em] outline-none focus-visible:ring-2 focus-visible:ring-acid"><span>{text}</span><span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-acid transition-transform duration-300 group-hover:scale-x-100" /></a>)}
          </nav>
          <div className="hidden lg:block"><Magnetic><Button variant="outline" onClick={onContact} className="border-paper/50 px-5 py-2.5 text-paper hover:bg-paper hover:text-ink">Start a project <ArrowUpRight size={14} /></Button></Magnetic></div>
          <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40 lg:hidden">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>
      {menuOpen && <div className="fixed inset-0 z-40 flex flex-col justify-center gap-4 bg-ink px-8 pt-16 text-paper lg:hidden" role="navigation" aria-label="Mobile navigation">
        {links.map(([text, href], index) => <a key={text} href={href} onClick={() => setMenuOpen(false)} className="border-b border-paper/20 py-3 font-display text-[clamp(4rem,16vw,7rem)] leading-none italic">0{index + 1} <span className="not-italic">{text}</span></a>)}
        <Button variant="accent" className="mt-8 self-start" onClick={() => { setMenuOpen(false); onContact() }}>Start a project <ArrowUpRight size={16}/></Button>
      </div>}
    </>
  )
}

function Hero() {
  return <section id="top" className="relative flex min-h-[720px] h-[100svh] max-h-[1100px] flex-col justify-end overflow-hidden bg-ink text-paper">
    <div className="absolute inset-0 overflow-hidden"><img className="hero-photo h-full w-full object-cover object-center" src="/images/hero.jpg" width="1376" height="768" alt="Modernist stone architecture overlooking the sea at golden hour" fetchPriority="high" decoding="async" /></div>
    <div className="hero-shade absolute inset-0" /><div className="hero-noise absolute inset-0" />
    <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-8 sm:px-9 lg:px-14 lg:pb-12">
      <div className="hero-kicker mb-auto flex items-start justify-between pt-32"><span className={`${label} leading-[1.6]`}>Independent creative practice<br />for the beautifully unexpected.</span><span className={`${label} hidden sm:block`}>Est. 2021 &nbsp; / &nbsp; Worldwide</span></div>
      <div className="max-w-[1200px]">
        <div className="line-mask"><span className="hero-line block font-display text-[clamp(3.1rem,14vw,15rem)] leading-[.68] tracking-[-.074em]">Form follows</span></div>
        <div className="line-mask"><span className="hero-line block pl-[13%] font-display text-[clamp(4rem,17.2vw,18rem)] italic leading-[.83] tracking-[-.077em]">feeling<span className="text-acid">.</span></span></div>
      </div>
      <div className="mt-8 flex items-end justify-between gap-6 border-t border-paper/40 pt-5 lg:mt-12">
        <span className="hero-bottom max-w-[330px] text-[12px] leading-[1.7] text-paper/85 sm:text-sm">We shape spaces, identities and experiences that stay with you.</span>
        <a href="#work" className="hero-bottom group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.18em] outline-none focus-visible:ring-2 focus-visible:ring-acid">Explore our work <span className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/60 transition-transform duration-300 group-hover:translate-y-1"><ArrowDown size={16}/></span></a>
      </div>
    </div>
    <div className="absolute right-4 top-[45%] hidden rotate-90 text-[9px] font-semibold uppercase tracking-[.26em] text-paper/70 lg:block">Scroll to explore — 01 / 03</div>
  </section>
}

function Intro() {
  return <section className="relative overflow-hidden bg-paper px-5 pb-28 pt-24 sm:px-9 lg:px-14 lg:pb-44 lg:pt-36">
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-12 flex items-center justify-between border-b border-ink/20 pb-4"><span className={label}>01 / A different perspective</span><span className={`${label} hidden sm:block`}>Who we are & what we believe</span><Plus size={17} strokeWidth={1}/></div>
      <div className="grid gap-10 lg:grid-cols-[1fr_2.5fr] lg:gap-20"><div data-reveal className="pt-3 text-xs leading-relaxed text-muted">Not quite an agency.<br />More than a studio.<br />Always curious.</div><div data-reveal><h2 className="max-w-[1050px] font-display text-[clamp(3.8rem,7.8vw,8.2rem)] leading-[.94] tracking-[-.06em]">We believe the most memorable things are the ones that make you <em className="font-normal text-[#8b9169]">feel.</em></h2><p className="mt-9 max-w-[490px] text-sm leading-[1.85] text-muted sm:ml-auto sm:mt-14">Atelier Void is a creative practice working across physical and digital worlds. We connect thoughtful strategy with instinctive expression to make work that means more.</p></div></div>
    </div>
  </section>
}

function ProjectCard({ project, index, onOpen }) {
  const category = categories.find((item) => item.id === project.category_id)
  return <button type="button" onClick={(event) => onOpen(project, event.currentTarget)} aria-label={`View project ${project.title}`} className={`project-card group block w-full min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 ${index === 1 ? 'lg:mt-52' : ''} ${index === 2 ? 'lg:col-span-2 lg:mt-14' : ''}`}>
    <div className={`project-media relative overflow-hidden bg-[#c7c3b8] ${index === 2 ? 'aspect-[1.05] sm:aspect-[1.8] lg:aspect-[2.12]' : 'aspect-[.9] sm:aspect-[1.05] lg:aspect-[.87]'}`}>
      <img src={project.image_url} alt={project.image_alt} width={project.image_width} height={project.image_height} loading="lazy" decoding="async" className="project-image h-full w-full object-cover" />
      <span className="absolute left-5 top-5 rounded-full border border-white/60 bg-ink/20 px-3 py-2 text-[10px] font-medium uppercase tracking-[.16em] text-white backdrop-blur-sm">{project.number} / 03</span>
      <span className="project-arrow absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink sm:h-14 sm:w-14"><ArrowUpRight size={21} strokeWidth={1.3}/></span>
    </div>
    <div className="mt-5 flex items-start justify-between gap-4 border-t border-ink/25 pt-4 sm:mt-6"><div><span className={`${label} text-muted`}>{category?.name} &nbsp; / &nbsp; {project.year}</span><h3 className="mt-2 font-display text-[clamp(2.2rem,4vw,4rem)] leading-none tracking-[-.04em]">{project.title}</h3></div><ArrowUpRight size={18} strokeWidth={1.2} className="mt-1 shrink-0"/></div>
  </button>
}

function ProjectSkeleton({ index }) {
  return <div aria-hidden="true" className={`${index === 1 ? 'lg:mt-52' : ''} ${index === 2 ? 'lg:col-span-2 lg:mt-14' : ''}`}><div className={`skeleton-shine relative overflow-hidden bg-[#d4d0c6] ${index === 2 ? 'aspect-[1.05] sm:aspect-[1.8] lg:aspect-[2.12]' : 'aspect-[.9] sm:aspect-[1.05] lg:aspect-[.87]'}`} /><div className="mt-5 h-3 w-24 bg-[#d4d0c6]"/><div className="mt-3 h-9 w-2/3 bg-[#d4d0c6]"/></div>
}

function Work({ onOpen }) {
  const { status, data, error, retry } = useProjects()
  const [filter, setFilter] = useState('all')
  const gridRef = useRef(null)
  const visible = filter === 'all' ? data : data.filter((project) => categories.find((category) => category.id === project.category_id)?.slug === filter)
  useLayoutEffect(() => {
    if (status !== 'success' || prefersLessMotion()) return undefined
    const context = gsap.context(() => {
      gsap.utils.toArray('.project-card').forEach((card) => {
        gsap.fromTo(card, { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true } })
      })
    }, gridRef)
    ScrollTrigger.refresh()
    return () => context.revert()
  }, [status, filter])
  return <section id="work" className="bg-paper px-5 pb-28 sm:px-9 lg:px-14 lg:pb-44">
    <div className="mx-auto max-w-[1500px]">
      <div className="flex items-center justify-between border-b border-ink/20 pb-4"><span className={label}>02 / The work</span><span className={`${label} text-muted`}>2025 — 2026</span></div>
      <div className="relative mt-12 flex flex-col justify-between gap-10 md:mt-16 lg:flex-row lg:items-end"><div data-reveal><span className="font-display text-[clamp(4.2rem,12vw,12rem)] leading-[.75] tracking-[-.075em]">Selected</span><br/><span className="font-display text-[clamp(6rem,14vw,14rem)] italic leading-[.76] tracking-[-.075em] text-[#8b9169]">work<span className="text-ink">.</span></span></div><p data-reveal className="max-w-[280px] pb-4 text-sm leading-[1.8] text-muted lg:mb-3">A few things we put our hearts into. Each a different story, each unmistakably its own.</p></div>
      <div className="mt-16 flex flex-wrap gap-x-7 gap-y-3 border-b border-ink/20 pb-5 sm:mt-24" role="group" aria-label="Filter projects">
        {[{ slug: 'all', name: 'All work' }, ...categories].map((category) => <button key={category.slug} type="button" onClick={() => setFilter(category.slug)} aria-pressed={filter === category.slug} className={`relative py-1 text-[11px] font-semibold uppercase tracking-[.15em] outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-ink ${filter === category.slug ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>{category.name}{filter === category.slug && <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-ink"/>}</button>)}
      </div>
      {status === 'error' ? <div role="alert" className="my-16 flex min-h-[340px] flex-col items-center justify-center border border-ink/20 p-8 text-center"><span className="font-display text-6xl italic">A little pause.</span><p className="mt-4 max-w-sm text-sm text-muted">{error} Our archive will be right back.</p><Button onClick={retry} className="mt-8">Try again <ArrowRight size={15}/></Button></div> : <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-x-9 gap-y-16 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-0" aria-busy={status === 'loading'}>{status === 'loading' ? [0, 1, 2].map((index) => <ProjectSkeleton key={index} index={index}/>) : visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={onOpen}/>)}</div>}
      <div className="mt-20 flex items-center justify-between border-t border-ink/20 pt-5 text-muted"><span className={label}>Made with intention. Always.</span><span className={label}>End of selection &nbsp; ↗</span></div>
    </div>
  </section>
}

function Studio() {
  return <section id="studio" className="overflow-hidden bg-ink px-5 py-24 text-paper sm:px-9 lg:px-14 lg:py-40"><div className="mx-auto max-w-[1500px]">
    <div className="flex items-center justify-between border-b border-paper/20 pb-4"><span className={label}>03 / The studio</span><span className={`${label} text-paper/50`}>A point of view, not a formula</span></div>
    <div className="relative pt-20 lg:pt-28"><div data-reveal className="mb-8 flex items-center gap-3 text-acid"><span className="h-2 w-2 rounded-full bg-acid"/><span className={label}>A small studio for big ideas</span></div><h2 data-reveal className="max-w-[1250px] font-display text-[clamp(4.1rem,10.4vw,11.3rem)] leading-[.83] tracking-[-.07em]">The space between <span className="italic text-acid">what is</span> and what <span className="italic">could be.</span></h2>
      <div className="mt-16 grid gap-12 border-t border-paper/20 pt-8 lg:mt-28 lg:grid-cols-[1fr_1.25fr_1.25fr] lg:gap-16"><span className={`${label} text-paper/45`}>Our thinking — 001</span><p data-reveal className="text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.5] tracking-[-.025em]">Good design starts with a question, not an answer. We listen, we explore, and then we make something impossible to ignore.</p><p data-reveal className="max-w-[370px] text-sm leading-[1.9] text-paper/55">No house style. No borrowed formulas. Just a close-knit team of thinkers and makers bringing fresh perspective to every collaboration, from the first conversation to the final detail.</p></div>
    </div>
  </div></section>
}

function Approach({ onContact }) {
  return <section id="approach" className="bg-[#dedbd1] px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]">
    <div className="flex items-center justify-between border-b border-ink/20 pb-4"><span className={label}>04 / How we work</span><span className={`${label} text-muted`}>Ideas made tangible</span></div>
    <div className="grid items-center gap-12 pt-14 lg:grid-cols-[1fr_1.02fr] lg:gap-24 lg:pt-24"><div data-reveal className="max-w-[650px]"><span className={`${label} text-[#656b52]`}>Considered from the start</span><h2 className="mt-7 font-display text-[clamp(4rem,9vw,10rem)] leading-[.79] tracking-[-.075em]">Curiosity<br/>is our <em className="font-normal">craft.</em></h2><p className="mt-10 max-w-[460px] text-sm leading-[1.9] text-muted sm:mt-14">From the first spark to the finishing touch, we bring a restless curiosity to every brief. We work closely, think openly, and build worlds people want to step into.</p><Magnetic className="mt-8"><Button onClick={onContact} className="px-7 py-4">Work with us <ArrowUpRight size={16}/></Button></Magnetic></div><div data-reveal className="relative lg:pl-10"><div className="aspect-[4/4.3] overflow-hidden bg-[#bcb5a8]"><img src="/images/project-03.jpg" alt="Creative exploration in a vast desert landscape" width="1264" height="848" loading="lazy" decoding="async" className="h-full w-full object-cover object-[53%_center]" /></div><div className="absolute -bottom-5 -left-3 flex h-28 w-28 items-center justify-center rounded-full bg-acid sm:-left-3 sm:h-36 sm:w-36 lg:-left-10"><span className="text-center text-[10px] font-semibold uppercase leading-[1.6] tracking-[.15em]">Imagine<br/>what's<br/>possible ↗</span></div></div></div>
    <div className="mt-36 grid gap-8 border-t border-ink/20 pt-7 sm:grid-cols-3 lg:mt-48">{[['01', 'Discover', 'Find the feeling behind the brief.'], ['02', 'Create', 'Give every good idea room to grow.'], ['03', 'Connect', 'Make something people remember.']].map(([number, title, text]) => <div data-reveal key={number} className="border-b border-ink/20 pb-7 sm:border-0"><span className={`${label} text-muted`}>{number} / 03</span><h3 className="mt-7 font-display text-5xl italic leading-none sm:text-6xl">{title}</h3><p className="mt-4 text-sm text-muted">{text}</p></div>)}</div>
  </div></section>
}

function Footer({ onContact }) {
  return <footer className="overflow-hidden bg-paper px-5 pb-8 pt-24 sm:px-9 lg:px-14 lg:pt-36"><div className="mx-auto max-w-[1500px]">
    <div className="flex items-center justify-between border-b border-ink/20 pb-4"><span className={label}>05 / What's next?</span><span className={`${label} text-muted`}>Good things begin here</span></div>
    <div className="pt-16 lg:pt-24"><p data-reveal className="text-sm text-muted">Have an idea worth making real?</p><button type="button" onClick={onContact} className="group mt-5 block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ink"><span className="block font-display text-[clamp(3.25rem,13.5vw,14.5rem)] leading-[.76] tracking-[-.075em]">Let's make</span><span className="flex items-end justify-between gap-2 font-display text-[clamp(3.25rem,13.5vw,14.5rem)] italic leading-[.82] tracking-[-.075em] text-[#879066] transition-transform duration-500 group-hover:translate-x-2">something <ArrowUpRight className="mb-1 h-8 w-8 shrink-0 text-ink transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 sm:h-20 sm:w-20" strokeWidth={.8}/></span><span className="block font-display text-[clamp(3.25rem,13.5vw,14.5rem)] leading-[.76] tracking-[-.075em]">matter.</span></button></div>
    <div className="mt-24 grid gap-10 border-t border-ink/20 pt-7 sm:grid-cols-2 lg:mt-36 lg:grid-cols-4"><div><span className={label}>Atelier Void.</span><p className="mt-4 max-w-52 text-xs leading-[1.8] text-muted">An independent creative practice for the beautifully unexpected.</p></div><div><span className={label}>Explore</span><div className="mt-4 flex flex-col items-start gap-2 text-xs text-muted"><a href="#work" className="hover:text-ink">Work</a><a href="#studio" className="hover:text-ink">Studio</a><a href="#approach" className="hover:text-ink">Approach</a></div></div><div><span className={label}>Get in touch</span><button type="button" onClick={onContact} className="mt-4 block border-b border-ink/30 pb-1 text-left text-xs text-muted hover:text-ink">Start a conversation ↗</button></div><div className="sm:text-right"><span className={label}>From anywhere, for everywhere.</span><a href="#top" className="mt-4 flex items-center gap-2 text-xs text-muted hover:text-ink sm:justify-end">Back to top ↑</a></div></div>
    <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-ink/20 pt-5 text-[10px] uppercase tracking-[.17em] text-muted"><span>© {new Date().getFullYear()} Atelier Void. Built with intention.</span><span>Independent by nature &nbsp; ✳</span></div>
  </div></footer>
}

function ContactDialog({ open, onOpenChange }) {
  const { status, error, submit, reset } = useInquiry()
  return <Dialog open={open} onOpenChange={(next) => { if (next) reset(); onOpenChange(next) }}><DialogContent>
    <span className={`${label} text-muted`}>Start something / 001</span>
    {status === 'success' ? <div role="status" className="py-12"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-acid"><Check size={23}/></span><DialogTitle className="mt-9 font-display text-6xl leading-none tracking-[-.05em] sm:text-7xl">It's in motion.</DialogTitle><DialogDescription className="mt-5 max-w-sm text-sm leading-[1.8] text-muted">Thanks for reaching out. Your note is ready for the team. In this demo it stays in your browser; connect the service to a database to deliver it.</DialogDescription><Button className="mt-9" onClick={() => onOpenChange(false)}>Back to the site <ArrowRight size={15}/></Button></div> : <><DialogTitle className="mt-6 font-display text-[clamp(4rem,8vw,6.8rem)] leading-[.8] tracking-[-.07em]">Let's make<br/><em className="font-normal text-[#879066]">it happen.</em></DialogTitle><DialogDescription className="mt-6 max-w-sm text-sm leading-[1.7] text-muted">Tell us a little about what you're imagining. The best ideas begin with a conversation.</DialogDescription><form className="mt-9 space-y-6" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); submit({ name: String(form.get('name')).trim(), email: String(form.get('email')).trim(), message: String(form.get('message')).trim() }) }}>
      <div><label htmlFor="inquiry-name" className={label}>Your name</label><Input id="inquiry-name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="How should we call you?" /></div>
      <div><label htmlFor="inquiry-email" className={label}>Email address</label><Input id="inquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></div>
      <div><label htmlFor="inquiry-message" className={label}>A few words about your idea</label><textarea id="inquiry-message" name="message" required minLength={10} maxLength={2000} rows={3} placeholder="The beginning of something good..." className="w-full resize-none border-b border-ink/25 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink/35 focus-visible:border-ink" /></div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <Button type="submit" disabled={status === 'submitting'} className="mt-2 w-full py-4 sm:w-auto">{status === 'submitting' ? 'Sending your note…' : 'Send your note'} <ArrowUpRight size={16}/></Button>
    </form></>}
  </DialogContent></Dialog>
}

function ProjectDetail({ project, sourceRect, sourceElement, onClose }) {
  const overlayRef = useRef(null)
  const backdropRef = useRef(null)
  const visualRef = useRef(null)
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const closingRef = useRef(false)
  const category = categories.find((item) => item.id === project.category_id)
  useLayoutEffect(() => {
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    if (prefersLessMotion()) return () => { document.body.style.overflow = oldOverflow; sourceElement?.focus() }
    const context = gsap.context(() => {
      const destination = visualRef.current.getBoundingClientRect()
      gsap.set(visualRef.current, { x: sourceRect.left - destination.left, y: sourceRect.top - destination.top, scaleX: sourceRect.width / destination.width, scaleY: sourceRect.height / destination.height, transformOrigin: '0 0' })
      gsap.set(backdropRef.current, { opacity: 0 })
      gsap.set(panelRef.current, { opacity: 0, y: 25 })
      gsap.to(backdropRef.current, { opacity: 1, duration: .45, ease: 'power2.out' })
      gsap.to(visualRef.current, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .85, ease: 'power3.inOut' })
      gsap.to(panelRef.current, { opacity: 1, y: 0, duration: .7, delay: .34, ease: 'power3.out' })
    }, overlayRef)
    return () => { context.revert(); document.body.style.overflow = oldOverflow; sourceElement?.focus() }
  }, [sourceRect, sourceElement])
  const close = () => {
    if (closingRef.current) return
    closingRef.current = true
    if (prefersLessMotion()) { onClose(); return }
    const destination = visualRef.current.getBoundingClientRect()
    gsap.to(panelRef.current, { opacity: 0, y: 20, duration: .25, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: .55, ease: 'power2.in' })
    gsap.to(visualRef.current, { x: sourceRect.left - destination.left, y: sourceRect.top - destination.top, scaleX: sourceRect.width / destination.width, scaleY: sourceRect.height / destination.height, duration: .65, ease: 'power3.inOut', onComplete: onClose })
  }
  useEffect(() => {
    const keydown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close() }
      if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  })
  return createPortal(<div ref={overlayRef} role="dialog" aria-modal="true" aria-label={`${project.title} project details`} className="fixed inset-0 z-[80] overflow-y-auto text-paper">
    <div ref={backdropRef} className="fixed inset-0 bg-ink" />
    <div ref={visualRef} className="relative h-[56vh] w-full overflow-hidden bg-[#797368] lg:fixed lg:inset-y-0 lg:left-0 lg:h-full lg:w-[61%]"><img src={project.image_url} alt={project.image_alt} width={project.image_width} height={project.image_height} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent"/><span className={`absolute bottom-7 left-6 ${label} lg:bottom-10 lg:left-10`}>Atelier Void / Project {project.number}</span></div>
    <div ref={panelRef} className="relative min-h-[44vh] bg-ink px-6 pb-10 pt-24 lg:ml-[61%] lg:flex lg:min-h-screen lg:flex-col lg:justify-end lg:px-12 lg:pb-12 lg:pt-28 xl:px-20"><span className={`${label} text-acid`}>{category?.name} &nbsp; / &nbsp; {project.year}</span><h2 className="mt-5 font-display text-[clamp(4rem,7vw,8.5rem)] leading-[.83] tracking-[-.065em]">{project.title}</h2><p className="mt-8 max-w-md text-sm leading-[1.85] text-paper/65 lg:mt-12">{project.description}</p><div className="mt-10 grid grid-cols-2 gap-8 border-t border-paper/25 pt-5"><div><span className={`${label} text-paper/40`}>Client</span><p className="mt-2 text-sm">{project.client}</p></div><div><span className={`${label} text-paper/40`}>Location</span><p className="mt-2 text-sm">{project.location}</p></div></div><div className="mt-8 border-t border-paper/25 pt-5"><span className={`${label} text-paper/40`}>Disciplines</span><p className="mt-2 text-sm">{project.disciplines.join(' · ')}</p></div><div className="mt-12 flex items-center gap-3 text-acid"><span className="h-[1px] w-8 bg-acid"/><span className={label}>Made with feeling</span></div></div>
    <button ref={closeRef} type="button" onClick={close} className="fixed right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink outline-none transition-transform duration-300 hover:rotate-90 focus-visible:ring-2 focus-visible:ring-acid lg:right-9 lg:top-9" aria-label="Close project details"><X size={22} strokeWidth={1.4}/></button>
  </div>, document.body)
}

export default function App() {
  const rootRef = useRef(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  useLayoutEffect(() => {
    if (prefersLessMotion()) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('.hero-line', { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .13, duration: 1.25, delay: .22, ease: 'power3.out' })
      gsap.fromTo('.hero-kicker, .hero-bottom', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .09, duration: .9, delay: .65, ease: 'power3.out' })
      gsap.fromTo('.hero-photo', { yPercent: 0, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
      gsap.fromTo('.reading-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 1 } })
    }, rootRef)
    return () => context.revert()
  }, [])
  return <div ref={rootRef} className="min-h-screen overflow-x-clip bg-paper"><div className="reading-progress fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-acid"/><Header onContact={() => setContactOpen(true)}/><main><Hero/><Intro/><Work onOpen={(project, element) => setSelected({ project, sourceRect: element.querySelector('.project-media').getBoundingClientRect(), sourceElement: element })}/><Studio/><Approach onContact={() => setContactOpen(true)}/></main><Footer onContact={() => setContactOpen(true)}/><ContactDialog open={contactOpen} onOpenChange={setContactOpen}/>{selected && <ProjectDetail {...selected} onClose={() => setSelected(null)}/>}</div>
}
