import { useState } from "react"
import { LayoutDashboard, FileText, Video, Users, ChevronDown, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

type SidebarItem = {
  icon: React.ElementType
  label: string
  link: string
  isActive?: boolean
  subItems?: { label: string; link: string }[]
}

type AdminSidebarProps = {
  selectedUser: number | "all"
  setSelectedUser: (userId: number | "all") => void
}

export function AdminSidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/admin-dashboard/analytics", isActive: pathname === "/admin-dashboard/analytics" },
    { icon: FileText, label: "All Scripts", link: "/admin/scripts", isActive: pathname === "/admin/scripts" },
    { icon: Video, label: "AI Videos", link: "/admin-dashboard/generated-video-management", isActive: pathname === "/admin-dashboard/generated-video-management" },
    { icon: Users, label: "User Management", link: "/admin/users", isActive: pathname === "/admin/users" },
  ]

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <div className="w-[220px] h-screen bg-[#080f25]/60 py-8 px-4 flex flex-col border-r border-white/10 relative z-10">
      <div className="flex flex-col items-center gap-4 mb-16">
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-full bg-white/10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2ad0aa58-207b-44c7-bf2f-c3777381ce42_removalai_preview-removebg-preview-X0lNxuAZYM1mk0ssA0BYFHsP8kXBUM.png"
            alt="Mirror mask logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-center">AntiProphet AI Admin</span>
      </div>

      <nav className="space-y-2 text-white flex-grow">
        {sidebarItems.map((item) => (
          <div key={item.label}>
            <Link href={item.link}>
              <div
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer relative ${
                  item.isActive ? "bg-white/5" : ""
                }`}
                onClick={() => item.subItems && toggleExpand(item.label)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.subItems &&
                  (expandedItems.includes(item.label) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </div>
            </Link>
            {item.subItems && expandedItems.includes(item.label) && (
              <div className="ml-8 mt-2 space-y-2">
                {item.subItems.map((subItem) => (
                  <Link key={subItem.label} href={subItem.link}>
                    <div className="text-sm py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer">
                      {subItem.label}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <Link href="/admin/profile">
          <div className="flex flex-col items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="text-sm text-center">
              <div className="font-medium">Admin User</div>
              <div className="text-white/50">Manage Account</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
