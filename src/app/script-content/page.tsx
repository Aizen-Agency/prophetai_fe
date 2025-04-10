"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Lock, Unlock, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'


const scriptTypes = [
  { value: "copy1", label: "Instagram Reels Copy 1" },
  { value: "copy2", label: "Instagram Reels Copy 2" },
  { value: "copy3", label: "Instagram Reels Copy 3" },
  { value: "copy4", label: "Instagram Reels Copy 4" },
  { value: "copy5", label: "Instagram Reels Copy 5" },
  { value: "copy6", label: "Instagram Reels Copy 6" },
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

export default function ScriptsPage() {
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedScript, setSelectedScript] = useState("copy1")
  const [script, setScript] = useState(scripts.copy1)
  const [isLocked, setIsLocked] = useState(false)

  const router = useRouter();


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(script.content)
      setIsCopied(true)
    //   toast({
    //     title: "Copied to clipboard",
    //     description: "The script has been copied to your clipboard.",
    //   })
    console.log("copied to clipboard")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    //   toast({
    //     title: "Copy failed",
    //     description: "Failed to copy the script. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      scripts[selectedScript as keyof typeof scripts] = script
    //   toast({
    //     title: "Changes saved",
    //     description: "Your edits to the script have been saved.",
    //   })
     console.log("saved changes")
    }
    setIsEditing(!isEditing)
  }

  const handleScriptChange = (value: string) => {
    if (!isLocked) {
      setSelectedScript(value)
      setScript(scripts[value as keyof typeof scripts])
      setIsEditing(false)
    } else {
    //   toast({
    //     title: "Script is locked",
    //     description: "Unlock the script to change it.",
    //     variant: "destructive",
    //   })
    console.log("Script is locked")
    }
  }

  const toggleLock = () => {
    setIsLocked(!isLocked)
    // toast({
    //   title: isLocked ? "Script unlocked" : "Script locked",
    //   description: isLocked ? "You can now change the script." : "The script is now locked.",
    // })
  }

  return (
    <div className="min-h-screen text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[#080f25]">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f25]/80 via-[#1a1c2e]/60 to-[#2d1b3d]/40"></div>

      {/* Sidebar Component */}
      <Sidebar activeItem="scripts" />

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

        {/* Script Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {scriptTypes.map((type) => (
            <Card
              key={type.value}
              className={`bg-[#151F38] border-none ${selectedScript === type.value ? "ring-2 ring-purple-500" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{type.label}</CardTitle>
                <RadioGroup value={selectedScript} onValueChange={handleScriptChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} className="border-white text-white" />
                    <Label htmlFor={type.value} className="text-white">
                      Select
                    </Label>
                  </div>
                </RadioGroup>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-white/70">
                  {scripts[type.value as keyof typeof scripts].content.slice(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Script Preview */}
        <Card className="bg-[#151F38] border-none mb-6">
          <CardHeader>
            <CardTitle className="text-white">{script.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={script.content}
                onChange={(e) => setScript({ ...script, content: e.target.value })}
                className="min-h-[300px] text-white bg-[#1F2A47] border-none resize-none"
              />
            ) : (
              <div className="text-white/80 whitespace-pre-wrap font-mono text-sm">{script.content}</div>
            )}
            <div className="mt-4 text-white/50 text-sm">Generated on: {script.date.toLocaleDateString()}</div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4 items-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleEdit}>
            {isEditing ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Script
              </>
            )}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={copyToClipboard}>
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {isCopied ? "Copied!" : "Copy Script"}
          </Button>
          <div className="flex items-center space-x-2 ml-auto">
            <Switch
              id="lock-script"
              checked={isLocked}
              onCheckedChange={toggleLock}
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="lock-script" className={`flex items-center ${isLocked ? "text-green-500" : "text-white"}`}>
              {isLocked ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
              {isLocked ? "Locked" : "Unlocked"}
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
