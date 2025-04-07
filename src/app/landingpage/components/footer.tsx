'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Waves } from 'lucide-react'

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

export function FooterComponent() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-start">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center mb-3">
            <Waves className="h-6 w-6 text-white mr-2" />
            <span className="text-xl font-bold text-white">Wavii</span>
          </div>
          <p className="text-gray-300 text-sm max-w-md mb-3">
            Empowering businesses with innovative solutions for a digital future. Join us on our mission to transform the way you work.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          <div>
            <h3 className="text-sm font-semibold mb-2">Contact</h3>
            <div className="text-gray-300 space-y-1 text-sm">
              <p>123 Business Street</p>
              <p>Suite 100</p>
              <p>San Francisco, CA 94107</p>
              <p>contact@wavii.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Legal</h3>
            <div className="space-y-1">
              <p className="text-gray-300 text-sm">Privacy Policy</p>
              <p className="text-gray-300 text-sm">Terms of Service</p>
              <p className="text-gray-300 text-sm">Cookie Policy</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} Wavii. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
