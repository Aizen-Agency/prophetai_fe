"use client"

import { Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
// import Heygen_voice_id from "../../../../public/Heygen Voice Id.png"
// import Heygen_avatar_id from "../../../../public/Heygen Avatar Id.png"
// import Heygen_dashboard from "../../../../public/Heygen Dashboard.png"
// import Heygen_api_key from "../../../../public/Heygen Api Key.png"
// import Heygen_template_id from "../../../../public/Heygen Template Id.png"

interface HeyGenTutorialProps {
  trigger: React.ReactNode;
}

export function HeyGenTutorial({ trigger }: HeyGenTutorialProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Function to update window dimensions
    const updateWindowDimensions = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Set dimensions on mount
    updateWindowDimensions();
    
    // Add event listener for window resize
    window.addEventListener("resize", updateWindowDimensions);
    
    // Clean up
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  
  // Calculate 70% of screen dimensions
  const contentWidth = windowSize.width * 0.7;
  const contentHeight = windowSize.height * 0.7;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
      <DialogContent 
        className="bg-[#2d313e] text-white border-zinc-700 p-4 max-w-none"
        style={{ 
          width: `${contentWidth}px`, 
          maxWidth: '90vw',
        }}
      >
        <div 
          className="p-6 overflow-y-auto no-scrollbar" 
          style={{ 
            maxHeight: `${contentHeight}px`,
            height: `${contentHeight}px`,
            overflowY: 'auto'
          }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-400" />
            HeyGen Setup Guide
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-2 text-purple-300">Step 1: Create a HeyGen Account</h4>
              <p className="text-sm mb-2">Start by creating an account on the HeyGen platform.</p>
              <div className="flex items-center mb-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs flex items-center gap-1 bg-blue-900/30 border-blue-700"
                  onClick={() => window.open('https://www.heygen.com/signup', '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit HeyGen
                </Button>
              </div>
              <img 
                src="https://wsadelzc6i66hzhm.public.blob.vercel-storage.com/Heygen%20Dashboard-zfTyfydfC0IT40c4cuDPdlbBm1y5qR.png"
                alt="HeyGen signup page" 
                className="rounded-md border border-zinc-700 mb-2 w-full" 
              />
            </div>

            <div>
              <h4 className="text-md font-medium mb-2 text-purple-300">Step 2: Get Your API Key</h4>
              <p className="text-sm mb-3">After logging in, navigate to the Settings and get your API key:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm pl-2 mb-3">
                <li>Go to your profile menu in the top-left corner</li>
                <li>Select "Settings".</li>
                <li>Click "Subscription and API".</li>
                <li>Copy the API key from "Heygen API" section</li>
              </ol>
              <img 
                src="https://wsadelzc6i66hzhm.public.blob.vercel-storage.com/Heygen%20API%20Key-JZkd6hZXdZPOpWlcHG5Hge9KITi2Ip.png" 
                alt="HeyGen API key section" 
                className="rounded-md border border-zinc-700 mb-2 w-full" 
              />
            </div>

            <div>
              <h4 className="text-md font-medium mb-2 text-purple-300">Step 3: Get Your Avatar ID</h4>
              <p className="text-sm mb-3">To find your Avatar ID:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm pl-2 mb-3">
                <li>Go to the "Avatars" section in the main navigation on left side</li>
                <li>Select an avatar or create a new one</li>
                <li>Click on the 3 dots on the right side of the avatar</li>
                <li>Click on the Avatar ID to copy avatar id</li>
              </ol>
              <img 
                src="https://wsadelzc6i66hzhm.public.blob.vercel-storage.com/Heygen%20Avatar%20Id-XndN6RqJxd7lJz9nkvwRafUFDPGJb2.png"
                alt="HeyGen Avatar section" 
                className="rounded-md border border-zinc-700 mb-2 w-full" 
              />
            </div>

            <div>
              <h4 className="text-md font-medium mb-2 text-purple-300">Step 4: Get Your Voice ID</h4>
              <p className="text-sm mb-3">To find your Voice ID:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm pl-2 mb-3">
                <li>Navigate to the "Voice" section on left side</li>
                <li>Browse through available voices or create a custom one</li>
                <li>Click on the 3 dots on the right side of the voice</li>
                <li>Click on the Voice ID to copy voice id</li>
              </ol>
              <img 
                src="https://wsadelzc6i66hzhm.public.blob.vercel-storage.com/Heygen%20Voice%20Id-eKAxUn0p3LnkneCLEd52Db5aXc5AHK.png"
                alt="HeyGen Voice section" 
                className="rounded-md border border-zinc-700 mb-2 w-full" 
              />
            </div>

            <div>
              <h4 className="text-md font-medium mb-2 text-purple-300">Step 5: Get Your Template ID (Optional)</h4>
              <p className="text-sm mb-3">For advanced users who want to use a specific video template:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm pl-2 mb-3">
                <li>Go to the "Templates" section</li>
                <li>Select a template or create a new one</li>
                <li>The Template ID can be found in the URL or details panel</li>
              </ol>
              <img 
                src="https://wsadelzc6i66hzhm.public.blob.vercel-storage.com/Heygen%20Template%20Id-VxS0jQbCA978MRFJbT7zBsKq7r4y1d.png" 
                alt="HeyGen Template section" 
                className="rounded-md border border-zinc-700 mb-2 w-full" 
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-700">
            <h4 className="text-md font-medium mb-2 text-blue-300">Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm pl-2">
              <li>Keep your API key secure and don't share it publicly</li>
              <li>You can use our default settings if you don't want to provide your own avatar id and voice id</li>
              <li>Free HeyGen accounts have limited generations per month</li>
              <li>For high-volume usage, consider upgrading your HeyGen account</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
