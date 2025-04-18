"use client"

import { LayoutDashboard, FileText, Video, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'


interface SidebarProps {
  activeItem?: string
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", link : 'dashboard' },
  { icon: FileText, label: "Script Generator", id: "scripts" , link : "script-idea" },
  // { icon: FileText, label: "Scripts", id: "all-scripts" , link : "script-idea" },
  { icon: Video, label: "Videos", id: "videos" , link : "your-video" },
  { icon: LayoutDashboard, label: "Analytics", id: "analytics", link : 'performance-tracker' },

]


export function Sidebar({ activeItem = "scripts" }: SidebarProps) {
  const router = useRouter();

  const navigate = (link: string) => {
    console.log("Navigating to:", link);
    router.push(`/${link}`);
  };
  
  return (
    <div className="w-[150px] h-screen bg-[#080f25]/60 py-8 px-4 flex flex-col border-r border-white/10 fixed left-0 top-0 z-10 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center gap-4 mb-16">
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-full bg-white/10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2ad0aa58-207b-44c7-bf2f-c3777381ce42_removalai_preview-removebg-preview-X0lNxuAZYM1mk0ssA0BYFHsP8kXBUM.png"
            alt="Mirror mask logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-center">AntiProphet AI</span>
      </div>

      <nav className="space-y-6 text-white flex-grow">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.link)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-white/5 cursor-pointer relative ${
              activeItem === item.id ? "bg-white/5" : ""
            }`}
          >
            <item.icon className="h-10 w-10 mb-2" />
            <span className="text-sm text-center">{item.label}</span>
            {activeItem === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex flex-col items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
            onClick={() => {navigate('performance-tracker')}}
            >
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Jessie" />
            <AvatarFallback>JE</AvatarFallback>
          </Avatar>
          <div className="text-sm text-center">
            <div className="font-medium">Jessie</div>
            <div className="text-white/50">Account</div>
          </div>
        </div>
      </div>
    </div>
  )
}
