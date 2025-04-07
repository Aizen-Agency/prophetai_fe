'use client'

import { useEffect, useRef } from 'react'
import { 
  FaApple, 
  FaFacebook, 
  FaGoogle, 
  FaAmazon, 
  FaMicrosoft, 
  FaTwitter, 
  FaLinkedin, 
  FaGithub 
} from 'react-icons/fa'

// Replace client logos with icons
const clientIcons = [
  { Icon: FaApple, name: 'Apple' },
  { Icon: FaFacebook, name: 'Facebook' },
  { Icon: FaGoogle, name: 'Google' },
  { Icon: FaAmazon, name: 'Amazon' },
  { Icon: FaMicrosoft, name: 'Microsoft' },
  { Icon: FaTwitter, name: 'Twitter' },
  { Icon: FaLinkedin, name: 'LinkedIn' },
  { Icon: FaGithub, name: 'GitHub' },
]

export function ClientLogoCarouselComponent() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current

    if (scrollContainer) {
      const scrollContent = Array.from(scrollContainer.children)
      scrollContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        scrollContainer.appendChild(duplicatedItem)
      })

      const scrollAnimation = () => {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft += 1
        }
      }

      const animationInterval = setInterval(scrollAnimation, 30)

      return () => clearInterval(animationInterval)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden bg-[#121218] py-10">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {clientIcons.map(({ Icon, name }, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 mx-4 w-[160px] flex items-center justify-center transition-opacity duration-500"
              >
                <Icon size={48} className="text-gray-400 hover:text-gray-200 transition-colors duration-300" aria-label={name} />
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121218] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#121218] to-transparent z-10" />
        </div>
      </div>
    </div>
  )
}