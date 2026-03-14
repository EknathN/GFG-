import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Resources', to: '/resources' },
  { label: 'Community', to: '/community' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
          {/* Brand */}
          <div>
<div className="inline-flex items-center gap-3 bg-white rounded-xl px-3 py-2 mb-4">
              <img src="/gfg-logo.png" alt="GeeksforGeeks" className="h-7 w-auto object-contain" />
              <div className="h-5 w-px bg-gray-300" />
              <img src="/rit-logo.png" alt="RIT" className="h-6 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering future tech leaders through coding, community, and collaboration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-gfg-green-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'LinkedIn', href: '#', icon: '💼' },
                { label: 'WhatsApp', href: '#', icon: '💬' },
                { label: 'Discord', href: '#', icon: '🎮' },
                { label: 'Instagram', href: '#', icon: '📸' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center gap-1 bg-gray-800 hover:bg-gfg-green text-gray-300 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <span>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              📧 gfgclub@rit.edu.in
            </p>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © 2026 GFG Campus Club @ RIT. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Built with ❤️ by the GFG Club Dev Team
          </p>
        </div>
      </div>
    </footer>
  );
}
