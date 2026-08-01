// Displays the shared website footer and quick navigation links.
const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        <div className="glass-card p-6 text-left">
          <div className="mb-3 text-lg font-semibold text-[var(--text-strong)]">Quick Links</div>
          <div className="space-y-2 text-sm text-[var(--text-weak)]">
            <a href="/" className="block transition hover:text-[var(--primary)]">Home</a>
            <a href="/events" className="block transition hover:text-[var(--primary)]">Events</a>
            <a href="/about" className="block transition hover:text-[var(--primary)]">About</a>
            <a href="/contact" className="block transition hover:text-[var(--primary)]">Contact</a>
          </div>
        </div>

        <div className="glass-card p-6 text-left">
          <div className="mb-3 text-lg font-semibold text-[var(--text-strong)]">Contact</div>
          <div className="text-sm text-[var(--text-weak)]">
            <div>support@eventhub.example</div>
            <div className="mt-2">+1 (555) 123-4567</div>
          </div>
        </div>

        <div className="glass-card p-6 text-left">
          <div className="mb-3 text-lg font-semibold text-[var(--text-strong)]">Social</div>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--text-weak)]">
            <a href="#" className="transition hover:text-[var(--primary)]">Twitter</a>
            <a href="#" className="transition hover:text-[var(--primary)]">Facebook</a>
            <a href="#" className="transition hover:text-[var(--primary)]">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 text-center text-xs text-[var(--text-weak)]">© {new Date().getFullYear()} EventHub. All rights reserved.</div>
    </footer>
  )
}

export default Footer
