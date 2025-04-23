"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Lock, Unlock, Copy, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/Sidebar"
import { useRouter, useSearchParams } from 'next/navigation'
import DataService from "@/app/service/DataService"
import { useLogin } from "@/context/LoginContext"
import LogoutButton from "@/components/LogoutButton"

type Script = {
  id: number
  idea_id: string
  idea_title: string
  script_title: string
  content: string
  is_locked: boolean
  date: string
}

export default function ScriptsPage() {
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedScript, setSelectedScript] = useState("copy1")
  const [scripts, setScripts] = useState<Record<string, Script>>({})
  const [isLocked, setIsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const scriptId = searchParams.get('id')
  const title = searchParams.get('title')
  const content = searchParams.get('content')

  const { userId, username } = useLogin()

  useEffect(() => {
    const fetchScripts = async () => {
      if (!title || !content || !userId) return

      try {
        setIsLoading(true)
        
        // First try to get saved script
        let savedScript = null
        try {
          // Get idea_id from localStorage
          const storedScripts = JSON.parse(localStorage.getItem('generatedScripts') || '[]')
          const currentScript = storedScripts.find((script: any) => script.id === parseInt(scriptId || '0'))
          const idea_id = currentScript?.idea_id

          if (idea_id) {
            const savedResponse = await DataService.getScript({
              user_id: userId,
              idea_id: idea_id
            })
            if (savedResponse.saved_script) {
              savedScript = savedResponse.saved_script
              setIsLocked(savedScript.is_locked)
            }
          }
        } catch (error) {
          console.error("Error fetching saved script:", error)
        }

        // Generate new scripts
        const response = await DataService.generateMultipleIdeas({
          product_name: title,
          description: content,
          link: "",
          script_idea: content
        })

        if (response && response.scripts) {
          const scriptsMap: Record<string, Script> = {}
          
          // Add saved script as first script if it exists
          if (savedScript) {
            scriptsMap['saved'] = {
              id: savedScript.id,
              idea_id: savedScript.idea_id,
              idea_title: savedScript.idea_title,
              script_title: savedScript.script_title,
              content: savedScript.script_content,
              is_locked: savedScript.is_locked,
              date: savedScript.date
            }
          }

          // Add new generated scripts
          response.scripts.forEach((script: any) => {
            scriptsMap[script.id] = {
              id: script.id,
              idea_id: response.idea_id,
              idea_title: response.idea_title,
              script_title: script.title,
              content: script.content,
              is_locked: false,
              date: script.date
            }
          })

          setScripts(scriptsMap)
          setSelectedScript(savedScript ? 'saved' : 'copy1')
        }
      } catch (error) {
        console.error("Error fetching scripts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScripts()
  }, [title, content, userId, scriptId])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scripts[selectedScript]?.content || "")
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      const updatedScripts = { ...scripts }
      updatedScripts[selectedScript] = {
        ...updatedScripts[selectedScript],
        content: updatedScripts[selectedScript].content
      }
      setScripts(updatedScripts)
    }
    setIsEditing(!isEditing)
  }

  const handleScriptChange = (value: string) => {
    if (!isLocked) {
      setSelectedScript(value)
      setIsEditing(false)
    }
  }

  const saveScript = async () => {
    try {
      setIsSaving(true)
      
      if (!userId) {
        console.error('User not authenticated')
        return
      }

      // Get the current script's idea_id from localStorage
      const storedScripts = JSON.parse(localStorage.getItem('generatedScripts') || '[]')
      const currentScript = storedScripts.find((script: any) => script.id === parseInt(scriptId || '0'))
      const idea_id = currentScript?.idea_id
      const idea_title = currentScript?.idea_title
      const script_title = currentScript?.script_title

      if (!idea_id) {
        console.error('No idea_id found for the current script')
        return
      }

      const scriptToSave = scripts[selectedScript]
      const response = await DataService.saveScript({
        user_id: userId,
        idea_id: idea_id,
        idea_title: idea_title,
        script_title: script_title,
        script_content: scripts[selectedScript].content,
        is_locked: isLocked
      })

      // Update localStorage with the script_id from the response
      const updatedScripts = storedScripts.map((script: any) => {
        if (script.id === parseInt(scriptId || '0')) {
          return {
            ...script,
            is_locked: isLocked,
            script_id: response.id // Add the script_id from the response
          }
        }
        return script
      })
      localStorage.setItem('generatedScripts', JSON.stringify(updatedScripts))
    } catch (error) {
      console.error('Error saving script:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteScript = async () => {
    try {
      setIsDeleting(true)
      
      if (!userId) {
        console.error('User not authenticated')
        return
      }

      await DataService.deleteScriptById({
        user_id: userId,
        script_id: scripts[selectedScript].id.toString()
      })
      router.push('/generated-scripts')
    } catch (error) {
      console.error('Error deleting script:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleLock = async () => {
    const newLockState = !isLocked
    setIsLocked(newLockState)
    
    if (newLockState) {
      await saveScript()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
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
          <p className="text-white/70 text-lg mt-2">Here are your generated scripts</p>
        </div>

        {/* Script Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Object.entries(scripts).map(([id, script]) => (
            <Card
              key={id}
              className={`bg-[#151F38] border-none ${selectedScript === id ? "ring-2 ring-purple-500" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{script.script_title}</CardTitle>
                <RadioGroup value={selectedScript} onValueChange={handleScriptChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={id} id={id} className="border-white text-white" />
                    <Label htmlFor={id} className="text-white">
                      Select
                    </Label>
                  </div>
                </RadioGroup>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-white/70">
                  {script.content.slice(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Script Preview */}
        {selectedScript && scripts[selectedScript] && (
          <Card className="bg-[#151F38] border-none mb-6">
            <CardHeader>
              <CardTitle className="text-white">{scripts[selectedScript].script_title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={scripts[selectedScript].content}
                  onChange={(e) => {
                    const updatedScripts = { ...scripts }
                    updatedScripts[selectedScript] = {
                      ...updatedScripts[selectedScript],
                      content: e.target.value
                    }
                    setScripts(updatedScripts)
                  }}
                  className="min-h-[300px] text-white bg-[#1F2A47] border-none resize-none"
                />
              ) : (
                <div className="text-white/80 whitespace-pre-wrap font-mono text-sm">{scripts[selectedScript].content}</div>
              )}
              <div className="mt-4 text-white/50 text-sm">Generated on: {new Date(scripts[selectedScript].date).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        )}

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
          {/* <Button 
            className="bg-red-600 hover:bg-red-700 text-white" 
            onClick={deleteScript}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Script
              </>
            )}
          </Button> */}
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

