const Footer = () => {
  return (
    <footer className="mt-12 py-10 bg-surface border-t border-surface">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
        <div className="bg-surface border border-surface rounded-3xl p-6 shadow-sm">
          <div className="font-semibold mb-2 text-slate-900 dark:text-white">Quick Links</div>
          <div className="space-y-1">
            <a href="/" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Home</a>
            <a href="/events" className="block text-slate-600 hover:text-slate-900 transition">Events</a>
            <a href="/about" className="block text-slate-600 hover:text-slate-900 transition">About</a>
            <a href="/contact" className="block text-slate-600 hover:text-slate-900 transition">Contact</a>
          </div>
        </div>

        <div className="bg-surface border border-surface rounded-3xl p-6 shadow-sm">
          <div className="font-semibold mb-2 text-slate-900 dark:text-white">Contact</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <div>support@eventhub.example</div>
            <div className="mt-2">+1 (555) 123-4567</div>
          </div>
        </div>

        <div className="bg-surface border border-surface rounded-3xl p-6 shadow-sm">
          <div className="font-semibold mb-2 text-slate-900 dark:text-white">Social</div>
          <div className="flex gap-3">
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Twitter</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Facebook</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-6 text-center text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} EventHub. All rights reserved.</div>
    </footer>
  )
}

export default Footer
