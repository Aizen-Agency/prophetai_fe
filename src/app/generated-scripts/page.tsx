"use client"

import { useState } from "react"
import { Check, ArrowLeft, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'


const scriptTypes = [
  { id: "copy1", label: "Instagram Reels Copy 1" },
  { id: "copy2", label: "Instagram Reels Copy 2" },
  { id: "copy3", label: "Instagram Reels Copy 3" },
  { id: "copy4", label: "Instagram Reels Copy 4" },
  { id: "copy5", label: "Instagram Reels Copy 5" },
  { id: "copy6", label: "Instagram Reels Copy 6" },
]

const scripts = {
  copy1: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 1)",
    content: `[Upbeat music starts]
👋 Hey creators! Tired of staring at blank screens?
🤖 Meet AntiProphet AI, your new content bestie!
💡 Input topic, get instant content magic!
📱 Social posts, blogs, scripts - you name it!
🎨 Learns your style, sounds like you!
🔍 SEO optimized for more views!
🚀 Boost productivity, save time!
😎 User-friendly, no tech wizardry needed!
🔥 Say bye to writer's block, hello to wow content!
🌟 Try AntiProphet AI now!
[Call to action: Swipe up to revolutionize your content game!]
#ContentCreation #AIAssistant #AntiProphetAI`,
    date: new Date(),
  },
  copy2: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 2)",
    content: `[Energetic beat drops]
🎭 Content creators, listen up!
😓 Struggling with writer's block?
🚀 Introducing AntiProphet AI!
⚡ Instant content generation
🧠 Learns your unique style
📊 SEO optimization built-in
⏱️ Save hours on content creation
🌈 Multiple formats, one tool
💪 Empower your creativity
🔥 Stand out in the digital noise
[Visual: "Try AntiProphet AI Free" button appears]
Don't miss out on the future of content creation!
#AntiProphetAI #ContentRevolution #CreatorTools`,
    date: new Date(),
  },
  copy3: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 3)",
    content: `[Upbeat electronic music]
👀 Attention all content creators!
🤯 Feeling overwhelmed by content demands?
🦸‍♀️ AntiProphet AI to the rescue!
🎨 Generate unique, on-brand content
⚡ Lightning-fast creation process
📈 Built-in SEO for maximum reach
🔄 Adapts to your style over time
💡 Never run out of ideas again
🚀 Skyrocket your content strategy
✨ Unlock your creative potential
[Text overlay: "Join the AI content revolution"]
Transform your content game with AntiProphet AI!
#AIContentCreation #DigitalMarketing #AntiProphetAI`,
    date: new Date(),
  },
  copy4: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 4)",
    content: `[Soft, inspiring background music]
📝 Content creation got you stressed?
😴 Tired of late nights brainstorming?
🌟 Meet AntiProphet AI - your creative companion
🧠 AI-powered content generation
🎯 Tailored to your brand voice
📊 SEO-optimized for better reach
⏰ Save time, boost productivity
🔍 Never struggle for ideas again
💪 Empower your content strategy
🚀 Take your brand to new heights
[Visual: "Start your free trial" CTA]
Experience the future of content creation now!
#ContentCreation #AITechnology #AntiProphetAI`,
    date: new Date(),
  },
  copy5: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 5)",
    content: `[Upbeat, motivational music]
🎭 Calling all content creators!
😓 Exhausted from constant content demands?
💡 Discover AntiProphet AI
🚀 Revolutionize your content strategy
⚡ Generate ideas in seconds
📝 Create blogs, social posts, and more
🧠 AI learns and adapts to your style
📈 Built-in SEO for maximum impact
⏳ Save time, reduce stress
🌈 Unleash your creative potential
[Text appears: "Join the AI content revolution"]
Level up your content game with AntiProphet AI!
#AIContentCreator #DigitalMarketing #AntiProphetAI`,
    date: new Date(),
  },
  copy6: {
    title: "AntiProphet AI: Content Creation Revolution (Instagram Reels Copy 6)",
    content: `[Dynamic, energetic music]
👋 Hey there, content creators!
😪 Tired of content creation burnout?
🦸 AntiProphet AI is here to save the day!
🧠 AI-powered content generation
🎨 Maintains your unique brand voice
📊 SEO-optimized for better visibility
⚡ Create content in minutes, not hours
📱 Perfect for social media, blogs, and more
🚀 Boost your productivity and reach
💪 Stay ahead of the competition
[Visual: "Try AntiProphet AI Now" button]
Revolutionize your content strategy today!
#ContentCreation #AIAssistant #AntiProphetAI`,
    date: new Date(),
  },
}

export default function DashboardPage() {
  const router = useRouter()

  const [selectedScripts, setSelectedScripts] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "az" | "za">("newest")

  const toggleScriptSelection = (scriptId: string) => {
    setSelectedScripts((prev) => {
      if (prev.includes(scriptId)) {
        return prev.filter((id) => id !== scriptId)
      } else {
        return [...prev, scriptId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedScripts.length === scriptTypes.length) {
      setSelectedScripts([])
    } else {
      setSelectedScripts(scriptTypes.map((script) => script.id))
    }
  }

  const handleGenerate = () => {
    if (selectedScripts.length === 0) {
    //   toast({
    //     title: "No scripts selected",
    //     description: "Please select at least one script to generate a video.",
    //     variant: "destructive",
    //   })
    console.log("No scripts selected");
      return
    }

    setIsGenerating(true)

    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
    //   toast({
    //     title: "Videos generated",
    //     description: `Successfully generated ${selectedScripts.length} video${selectedScripts.length > 1 ? "s" : ""}.`,
    //   })
    console.log("Video generated")
    router.push('/your-video')
    }, 2000)
  }

  const sortedScriptTypes = [...scriptTypes].sort((a, b) => {
    const scriptA = scripts[a.id as keyof typeof scripts]
    const scriptB = scripts[b.id as keyof typeof scripts]
    switch (sortOption) {
      case "newest":
        return scriptB.date.getTime() - scriptA.date.getTime()
      case "oldest":
        return scriptA.date.getTime() - scriptB.date.getTime()
      case "az":
        return a.label.localeCompare(b.label)
      case "za":
        return b.label.localeCompare(a.label)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f25]">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f25]/80 via-[#1a1c2e]/60 to-[#2d1b3d]/40"></div>

      {/* Sidebar Component */}
      <Sidebar activeItem="scripts"/>

      {/* Main Content */}
      <div className="flex-grow p-10 relative z-10 overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => {
            // Add navigation logic here
            console.log("Back button clicked")
          }}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Welcome back, Jessie</h1>
          <p className="text-white/70 text-lg mt-2">Here are your generated scripts</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Card className="bg-white/10 border-none shadow-lg">
              <CardContent className="flex items-center p-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white mr-2 flex items-center justify-center cursor-pointer ${
                    selectedScripts.length === scriptTypes.length ? "bg-white" : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  {selectedScripts.length === scriptTypes.length && <Check className="h-3 w-3 text-black" />}
                </div>
                <Label className="text-white cursor-pointer" onClick={handleSelectAll}>
                  Select All
                </Label>
              </CardContent>
            </Card>
            <div className="text-white/70">
              {selectedScripts.length} of {scriptTypes.length} selected
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-none text-white">
                  Sort by <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/10 border-none text-white">
                <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("oldest")}>Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("az")}>A-Z</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("za")}>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleGenerate}
              disabled={selectedScripts.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Videos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Script List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {sortedScriptTypes.map((type) => (
            <Card
              key={type.id}
              className={`bg-white/10 border-none shadow-lg transition-all ${
                selectedScripts.includes(type.id) ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer ${
                    selectedScripts.includes(type.id) ? "bg-white" : ""
                  }`}
                  onClick={() => toggleScriptSelection(type.id)}
                >
                  {selectedScripts.includes(type.id) && <Check className="h-3 w-3 text-black" />}
                </div>
                <CardTitle className="text-white text-lg">{type.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-sm line-clamp-3 mb-2">
                  {scripts[type.id as keyof typeof scripts].content.slice(0, 150)}...
                </p>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  {new Date(scripts[type.id as keyof typeof scripts].date).toLocaleDateString()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
