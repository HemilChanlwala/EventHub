const Footer = () => {
  return (
    <footer className="mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
        <div className="glass p-6">
          <div className="font-semibold mb-2">Quick Links</div>
          <div className="space-y-1">
            <a href="/" className="block hover:text-indigo-600">Home</a>
            <a href="/events" className="block hover:text-indigo-600">Events</a>
            <a href="/about" className="block hover:text-indigo-600">About</a>
            <a href="/contact" className="block hover:text-indigo-600">Contact</a>
          </div>
        </div>

        <div className="glass p-6">
          <div className="font-semibold mb-2">Contact</div>
          <div className="text-sm text-gray-300">
            <div>support@eventhub.example</div>
            <div className="mt-2">+1 (555) 123-4567</div>
          </div>
        </div>

        <div className="glass p-6">
          <div className="font-semibold mb-2">Social</div>
          <div className="flex gap-3">
            <a href="#" className="hover:text-indigo-300">Twitter</a>
            <a href="#" className="hover:text-indigo-300">Facebook</a>
            <a href="#" className="hover:text-indigo-300">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} EventHub. All rights reserved.</div>
    </footer>
  )
}

export default Footer
