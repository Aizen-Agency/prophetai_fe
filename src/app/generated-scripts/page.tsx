"use client"

import { useState, useEffect } from "react"
import { Check, ArrowLeft, Plus, ChevronDown, Mic, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'

// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import DataService from "@/app/service/DataService"
import { useLogin } from "@/context/LoginContext"
import LogoutButton from "@/components/LogoutButton"
import Cookies from 'js-cookie';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { HeyGenTutorial } from "./tutorial/tutorial"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HeyGenErrorHandler } from "./error_handler_heygen/error_handler"

type Script = {
  id: number
  idea_id: string
  idea_title: string
  script_title: string
  content: string
  is_locked: boolean
  isLiked: boolean
  hasVoice: boolean
  script_id?: string
}

type HeyGenSettings = {
  apiKey: string
  avatarId: string
  voiceId: string
  background: {
    type: "color" | "image" | "video"
    value?: string
    url?: string
    assetId?: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [selectedScripts, setSelectedScripts] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "az" | "za">("newest")
  const [scripts, setScripts] = useState<Script[]>([])
  const [isHeyGenDialogOpen, setIsHeyGenDialogOpen] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [heyGenSettings, setHeyGenSettings] = useState<HeyGenSettings>({
    apiKey: "",
    avatarId: "",
    voiceId: "",
    background: {
      type: "color",
      value: "#008000"
    }
  })
  const [useDefaultSettings, setUseDefaultSettings] = useState(false)
  const [error, setError] = useState<{
    type: "missing_attributes" | "backend_error" | "api_error" | "network_error"
    message: string
  } | null>(null)

  const { userId, username } = useLogin()

  useEffect(() => {
    // Load scripts from localStorage
    const storedScripts = localStorage.getItem('generatedScripts')
    if (storedScripts) {
      const parsedScripts = JSON.parse(storedScripts)
      setScripts(parsedScripts.map((script: any) => ({
        id: script.id,
        idea_id: script.idea_id,
        idea_title: script.topic,
        script_title: script.script_title,
        content: script.content,
        is_locked: script.is_locked,
        isLiked: script.isLiked,
        hasVoice: script.hasVoice,
        script_id: script.script_id || (script.is_locked ? "saved" : undefined) // If script has script_id or is locked, mark as saved
      })))
    }

    // Load previous HeyGen settings from localStorage if available
    const savedSettings = localStorage.getItem('heyGenSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Ensure background object exists with default values
      setHeyGenSettings({
        ...parsed,
        background: parsed.background || {
          type: "color",
          value: "#008000"
        }
      });
    }
    
    // Load useDefault preference
    const useDefault = localStorage.getItem('useDefaultHeyGenSettings')
    if (useDefault) {
      setUseDefaultSettings(useDefault === 'true')
    }
  }, [])

  const toggleScriptSelection = (scriptId: number) => {
    setSelectedScripts((prev) => {
      // If the script is already selected, deselect it
      if (prev.includes(scriptId)) {
        return [];
      }
      // Otherwise, select only this script
      return [scriptId];
    });
  };

  const handleSelectAll = () => {
    // Since we only allow one selection, this will clear the selection
    setSelectedScripts([]);
  };

  const handleHeyGenSettingsChange = (field: keyof HeyGenSettings | 'background', value: any) => {
    if (field === 'background') {
      setHeyGenSettings(prev => ({
        ...prev,
        background: {
          ...prev.background,
          ...value
        }
      }))
    } else {
      setHeyGenSettings(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const saveHeyGenSettings = () => {
    localStorage.setItem('heyGenSettings', JSON.stringify(heyGenSettings))
    localStorage.setItem('useDefaultHeyGenSettings', useDefaultSettings.toString())
  }

  const toggleUseDefaultSettings = () => {
    setUseDefaultSettings(prev => !prev)
  }

  const handleGenerateClick = () => {
    if (selectedScripts.length === 0) {
      console.log("No scripts selected")
      return
    }
    setIsHeyGenDialogOpen(true)
  }

  const handleGenerate = async () => {
    if (selectedScripts.length === 0) {
      setError({
        type: "missing_attributes",
        message: "Please select at least one script to generate a video"
      })
      return
    }

    if (!useDefaultSettings && (!heyGenSettings.apiKey || !heyGenSettings.avatarId || !heyGenSettings.voiceId)) {
      setError({
        type: "missing_attributes",
        message: "Please provide all required HeyGen settings or use default settings"
      })
      return
    }

    setIsGenerating(true)
    setIsHeyGenDialogOpen(false)
    saveHeyGenSettings()

    try {
      if (!userId) {
        setError({
          type: "backend_error",
          message: "User not authenticated. Please log in again."
        })
        return
      }

      // For each selected script, generate a video
      const videoPromises = selectedScripts.map(scriptId => {
        const script = scripts.find(s => s.id === scriptId)
        if (!script) {
          setError({
            type: "backend_error",
            message: `Script with id ${scriptId} not found`
          })
          return null
        }
        
        // Get transcript from localStorage based on idea_id
        const storedScripts = JSON.parse(localStorage.getItem('generatedScripts') || '[]')
        const currentScript = storedScripts.find((s: any) => s.id === scriptId)
        const transcript = currentScript?.transcript || "transcript"
        
        return DataService.generateVideo({
          user_id: userId,
          script_id: script.idea_id,
          transcript: transcript,
          heygen: useDefaultSettings ? 
            { useDefault: true } : 
            {
              apiKey: heyGenSettings.apiKey,
              avatarId: heyGenSettings.avatarId,
              voiceId: heyGenSettings.voiceId,
              useDefault: false,
              background: {
                type: heyGenSettings.background.type,
                ...(heyGenSettings.background.type === 'color' && { value: heyGenSettings.background.value }),
                ...(heyGenSettings.background.type !== 'color' && heyGenSettings.background.url && { url: heyGenSettings.background.url }),
                ...(heyGenSettings.background.type !== 'color' && heyGenSettings.background.assetId && { assetId: heyGenSettings.background.assetId })
              }
            }
        }).catch(error => {
          setError({
            type: "api_error",
            message: `Error generating video for script ${scriptId}: ${error.message}`
          })
          return null
        })
      })

      // Store the first selected script's idea_id in a cookie for later use
      const firstSelectedScript = scripts.find(s => s.id === selectedScripts[0])
      if (firstSelectedScript) {
        Cookies.set("idea_id", firstSelectedScript.idea_id, {
          secure: true,
          sameSite: 'strict', 
          expires: 7
        })
      }
       
      // Wait for all videos to be generated
      const results = await Promise.all(videoPromises.filter(Boolean))
      
      // Check if any videos were successfully generated
      const successfulGenerations = results.filter(result => result !== null)
      
      if (successfulGenerations.length > 0) {
        // Extract all video IDs from successful generations
        const videoIds = successfulGenerations.map(result => result.video_id)
        // Navigate to the videos page with all video IDs
        router.push(`/your-video?video_ids=${videoIds.join(',')}`)
      } else {
        setError({
          type: "backend_error",
          message: "Failed to generate any videos. Please try again."
        })
      }
    } catch (error) {
      setError({
        type: "network_error",
        message: "An unexpected error occurred. Please try again later."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const sortedScripts = [...scripts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.id - a.id
      case "oldest":
        return a.id - b.id
      case "az":
        return a.script_title.localeCompare(b.script_title)
      case "za":
        return b.script_title.localeCompare(a.script_title)
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
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <LogoutButton />
        <Button
          variant="ghost"
          size="icon"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Welcome back, {username || 'User'}</h1>
          <p className="text-white/70 text-lg mt-2">Here are your liked script ideas</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Card className="bg-white/10 border-none shadow-lg">
              <CardContent className="flex items-center p-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white mr-2 flex items-center justify-center cursor-pointer ${
                    selectedScripts.length === 1 ? "bg-white" : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  {selectedScripts.length === 1 && <Check className="h-3 w-3 text-black" />}
                </div>
                <Label className="text-white cursor-pointer" onClick={handleSelectAll}>
                  Clear Selection
                </Label>
              </CardContent>
            </Card>
            <div className="text-white/70">
              {selectedScripts.length} of {scripts.length} selected
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
              onClick={handleGenerateClick}
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
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Script List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {sortedScripts.map((script) => (
            <Card
              key={script.id}
              className={`bg-white/10 border-none shadow-lg transition-all cursor-pointer ${
                selectedScripts.includes(script.id) ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer ${
                    selectedScripts.includes(script.id) ? "bg-white" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScriptSelection(script.id);
                  }}
                >
                  {selectedScripts.includes(script.id) && <Check className="h-3 w-3 text-black" />}
                </div>
                <CardTitle 
                  className="text-white text-lg cursor-pointer"
                  onClick={() => {
                    router.push(`/script-content?id=${script.id}&title=${encodeURIComponent(script.script_title)}&content=${encodeURIComponent(script.content)}`)
                  }}
                >
                  {script.script_title}
                </CardTitle>
              </CardHeader>
              <CardContent
                onClick={() => {
                  router.push(`/script-content?id=${script.id}&title=${encodeURIComponent(script.script_title)}&content=${encodeURIComponent(script.content)}`)
                }}
              >
                <p className="text-white/70 text-sm line-clamp-3 mb-2">
                  {script.content}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                    Liked
                  </Badge>
                  {script.script_id && (
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-white">
                      💾 Script Saved
                    </Badge>
                  )}
                  {script.hasVoice && (
                    <Badge variant="secondary" className="text-xs bg-purple-500/20 text-white">
                      <Mic className="h-3 w-3 mr-1" />
                      Voice Recorded
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* HeyGen Settings Dialog */}
      <Dialog open={isHeyGenDialogOpen} onOpenChange={setIsHeyGenDialogOpen}>
        <DialogContent className="bg-[#1a1c2e] text-white border-zinc-700 max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">HeyGen API Settings</DialogTitle>
              
            </div>
            <div className="flex items-center justify-between">
              <DialogDescription className="text-zinc-400">
                Enter your HeyGen API credentials to generate the video
              </DialogDescription>
            <HeyGenTutorial 
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <HelpCircle className="h-5 w-5 text-white/70" />
                    <span className="sr-only">HeyGen Setup Guide</span>
                  </Button>
                } 
              />
            </div>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="useDefault"
              checked={useDefaultSettings}
              onChange={toggleUseDefaultSettings}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <Label htmlFor="useDefault" className="text-white cursor-pointer">
              Use default settings (from server)
            </Label>
          </div>
          
          <div className={`grid gap-4 py-4 ${useDefaultSettings ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="apiKey" className="text-white">API Key</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-2">
                        <Info className="h-3.5 w-3.5 text-zinc-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Found in HeyGen Developer settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={heyGenSettings.apiKey}
                  onChange={(e) => handleHeyGenSettingsChange("apiKey", e.target.value)}
                  className="pr-20 border-2 border-primary/50 focus:border-primary"
                  required
                  placeholder="Enter your HeyGen API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="avatarId" className="text-white">Avatar ID</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-2">
                        <Info className="h-3.5 w-3.5 text-zinc-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Found in Avatars section</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="avatarId" 
                value={heyGenSettings.avatarId}
                onChange={(e) => handleHeyGenSettingsChange("avatarId", e.target.value)}
                className="bg-[#2d2d3d] border-zinc-700 text-white"
                placeholder="Enter your avatar ID"
                disabled={useDefaultSettings}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="voiceId" className="text-white">Voice ID</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-2">
                        <Info className="h-3.5 w-3.5 text-zinc-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Found in Voice section</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input 
                id="voiceId"
                value={heyGenSettings.voiceId}
                onChange={(e) => handleHeyGenSettingsChange("voiceId", e.target.value)}
                className="bg-[#2d2d3d] border-zinc-700 text-white"
                placeholder="Enter your voice ID"
                disabled={useDefaultSettings}
              />
            </div>
            <div className="grid gap-2">
              <Label>Background Type</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-[#2d2d3d] border-zinc-700 text-white hover:bg-[#3d3d4d]">
                    {(heyGenSettings.background?.type || "color").charAt(0).toUpperCase() + 
                     (heyGenSettings.background?.type || "color").slice(1)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2d2d3d] border-zinc-700">
                  <DropdownMenuItem onClick={() => handleHeyGenSettingsChange("background", { type: "color", value: "#008000" })} className="text-white hover:bg-[#3d3d4d]">
                    Color
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHeyGenSettingsChange("background", { type: "image" })} className="text-white hover:bg-[#3d3d4d]">
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHeyGenSettingsChange("background", { type: "video" })} className="text-white hover:bg-[#3d3d4d]">
                    Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {heyGenSettings.background.type === "color" && (
                <Input
                  type="color"
                  value={heyGenSettings.background.value || "#008000"}
                  onChange={(e) => handleHeyGenSettingsChange("background", { value: e.target.value })}
                  className="bg-[#2d2d3d] border-zinc-700 text-white h-10"
                />
              )}

              {(heyGenSettings.background.type === "image" || heyGenSettings.background.type === "video") && (
                <>
                  <Input
                    placeholder={`Enter ${heyGenSettings.background.type} URL`}
                    value={heyGenSettings.background.url || ""}
                    onChange={(e) => handleHeyGenSettingsChange("background", { url: e.target.value })}
                    className="bg-[#2d2d3d] border-zinc-700 text-white"
                  />
                  <Input
                    placeholder={`Enter ${heyGenSettings.background.type} asset ID`}
                    value={heyGenSettings.background.assetId || ""}
                    onChange={(e) => handleHeyGenSettingsChange("background", { assetId: e.target.value })}
                    className="bg-[#2d2d3d] border-zinc-700 text-white"
                  />
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsHeyGenDialogOpen(false)}
              className="bg-transparent border-zinc-600 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!useDefaultSettings && (!heyGenSettings.apiKey || !heyGenSettings.avatarId || !heyGenSettings.voiceId)}
            >
              Generate Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <HeyGenErrorHandler 
        error={error} 
        onClose={() => setError(null)} 
      />
    </div>
  )
}
