"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, Plus, X, Twitter, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/Sidebar"  
import DataService from "@/app/service/DataService"
import { useRouter } from "next/navigation"
import { getCookie } from "@/lib/utils"
import { useLogin } from "@/context/LoginContext"
import { useAudioRecorder } from '@/lib/audioUtils';
import { TranscriptionService } from '@/app/service/TranscriptionService';
import LogoutButton from "@/components/LogoutButton"
import { v4 as uuidv4 } from 'uuid'
import { useTwitterScraper } from "@/context/twitterScraperContext"

type Product = {
  id: number
  name: string
  description: string
  link?: string
}

type ScriptIdea = {
  id: number
  topic: string
  tweet: string
  isLiked?: boolean
  hasVoice?: boolean
  transcript?: string
}

type XChannel = {
  id: number
  name: string
  url: string
}

type ScrapedTwitterData = {
  profile_url: string
  product_name: string
  articles_scraped: number
  tweets: any[]
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "AntiProphet AI",
      description: "AI-powered content generation tool",
      link: "https://antiprophet.ai",
    },
  ])
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({ name: "", description: "", link: "" })
  const [scriptIdeas, setScriptIdeas] = useState<ScriptIdea[]>([])
  const [xChannels, setXChannels] = useState<XChannel[]>([
    { id: 1, name: "Main Account", url: "https://x.com/mainaccount" },
  ])
  const [newXChannel, setNewXChannel] = useState<Omit<XChannel, "id">>({ name: "", url: "" })
  const [showXChannels, setShowXChannels] = useState(false)
  const [expandedIdeas, setExpandedIdeas] = useState<number[]>([])
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)

  const [textFilter, setTextFilter] = useState<string>("")
  const [contentTypeFilters, setContentTypeFilters] = useState({
    images: true,
    videos: true,
    text: true,
  })

  const [ideaRatings, setIdeaRatings] = useState<Record<number, "up" | "down" | null>>({})
  const [recordingIdea, setRecordingIdea] = useState<number | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isAdding, setIsAdding] = useState(false);

  const [likedIdeas, setLikedIdeas] = useState<ScriptIdea[]>([])
  
  // Twitter scraping states
  const [isScrapingTwitter, setIsScrapingTwitter] = useState(false)
  const [scrapedTwitterData, setScrapedTwitterData] = useState<ScrapedTwitterData | null>(null)

  const router = useRouter()
  const { userId, username } = useLogin()
  const { isRecording, recordingTime: audioRecordingTime, startRecording, stopRecording, updateRecordingTranscript } = useAudioRecorder();
  const transcriptionService = TranscriptionService.getInstance();
  const { scrapeTwitter, loading: twitterScraping } = useTwitterScraper();

  useEffect(() => {
    setIsScrapingTwitter(twitterScraping);
  }, [twitterScraping]);

  useEffect(() => {
    const fetchChannels = async () => {
      const userId = parseInt(getCookie('userId') || '0');
      console.log("userId in useEffect", userId)
      if (userId) {
        try {
          const response = await DataService.getChannels(userId);
          if (response) {
            console.log("response", response)
            const fetchedProducts = response.channels.map((channel: any) => ({
              id: channel.id,
              name: channel.product_name,
              description: channel.description || '',
              link: channel.link || '',
            }));
            
            setProducts(fetchedProducts);
            
            // Check if any channel has a Twitter link
            const twitterChannel = fetchedProducts.find((product: Product) => 
              product.link && 
              (product.link.includes('twitter.com') || product.link.includes('x.com'))
            );
            
            // If we have a Twitter link, scrape it
            if (twitterChannel && twitterChannel.link) {
              const storedData = localStorage.getItem('scrapedTwitterData');
              const parsedData = storedData ? JSON.parse(storedData) : null;
              
              // Only scrape if we don't have data for this URL or the product name is different
              if (!parsedData || 
                  parsedData.profile_url !== twitterChannel.link || 
                  parsedData.product_name !== twitterChannel.name) {
                scrapeTwitterProfile(twitterChannel.link, twitterChannel.name);
              } else {
                // Use the stored data
                setScrapedTwitterData(parsedData);
                console.log("Using stored Twitter data:", parsedData);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching channels:', error);
        }
      }
    };
    fetchChannels();
    
    // Check if we have stored scraped data
    const storedData = localStorage.getItem('scrapedTwitterData');
    if (storedData) {
      setScrapedTwitterData(JSON.parse(storedData));
    }
  }, []);
  
  const scrapeTwitterProfile = async (profileUrl: string, productName: string) => {
    setIsScrapingTwitter(true);
    try {
      // Check if we have stored data and its timestamp
      const storedData = localStorage.getItem('scrapedTwitterData');
      const parsedData = storedData ? JSON.parse(storedData) : null;
      
      // Check if we need to scrape new data
      const shouldScrape = !parsedData || 
                          parsedData.profile_url !== profileUrl || 
                          parsedData.product_name !== productName ||
                          !parsedData.timestamp ||
                          new Date().getTime() - new Date(parsedData.timestamp).getTime() > 24 * 60 * 60 * 1000; // 24 hours

      if (shouldScrape) {
        console.log('Starting Twitter scraping for profile:', profileUrl);
        const result = await scrapeTwitter(profileUrl);
        
        if (result && result.posts && result.posts.length > 0) {
          // Format the tweets to match what the backend expects
          const formattedTweets = result.posts.map(post => ({
            url: post.url,
            text: post.text,
            likesCount: post.likesCount,
            retweetsCount: post.retweetsCount,
            repliesCount: post.repliesCount,
            timestamp: post.timestamp
          }));
          
          const scrapedData = {
            profile_url: profileUrl,
            product_name: productName,
            articles_scraped: formattedTweets.length,
            tweets: formattedTweets,
            timestamp: new Date().toISOString()
          };
          
          // Store in state and local storage
          setScrapedTwitterData(scrapedData);
          localStorage.setItem('scrapedTwitterData', JSON.stringify(scrapedData));
          
          // Update insights in backend
          try {
            const userId = parseInt(getCookie('userId') || '0');
            if (userId) {
              await DataService.updateInsights({
                user_id: userId,
                articles_scraped: formattedTweets.length
              });
              console.log("Updated insights in backend");
            }
          } catch (error) {
            console.error("Error updating insights:", error);
          }
          
          console.log("Stored new Twitter data in local storage:", scrapedData);
        } else {
          console.warn("No tweets found, using mock data for development");
          
          // Create mock Twitter data for development
          const mockTweets = [
            {
              url: `${profileUrl}/status/1`,
              text: `Check out ${productName} - our revolutionary new product that helps content creators save time!`,
              likesCount: 45,
              retweetsCount: 12,
              repliesCount: 5,
              timestamp: new Date().toISOString()
            },
            {
              url: `${profileUrl}/status/2`,
              text: `We're excited to announce new features in ${productName}! Now with AI-powered content generation.`,
              likesCount: 78,
              retweetsCount: 23,
              repliesCount: 8,
              timestamp: new Date(Date.now() - 86400000).toISOString() // Yesterday
            },
            {
              url: `${profileUrl}/status/3`,
              text: `Users are loving ${productName}! "This tool has saved me hours of work every week" says one happy customer.`,
              likesCount: 105,
              retweetsCount: 34,
              repliesCount: 12,
              timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ];
          
          const scrapedData: ScrapedTwitterData = {
            profile_url: profileUrl,
            product_name: productName,
            articles_scraped: mockTweets.length,
            tweets: mockTweets
          };
          
          // Store mock data
          setScrapedTwitterData(scrapedData);
          localStorage.setItem('scrapedTwitterData', JSON.stringify(scrapedData));
          console.log("Stored mock Twitter data in local storage:", scrapedData);
        }
      } else {
        // Use the stored data
        setScrapedTwitterData(parsedData);
        console.log("Using stored Twitter data:", parsedData);
      }
    } catch (error) {
      console.error('Error scraping Twitter profile:', error);
      
      // Fall back to mock data on error
      const mockTweets = [
        {
          url: `${profileUrl}/status/1`,
          text: `Error occurred but we're using fallback data for ${productName}. Our product helps content creators thrive!`,
          likesCount: 35,
          retweetsCount: 8,
          repliesCount: 3,
          timestamp: new Date().toISOString()
        }
      ];
      
      const scrapedData: ScrapedTwitterData = {
        profile_url: profileUrl,
        product_name: productName,
        articles_scraped: mockTweets.length,
        tweets: mockTweets
      };
      
      // Store mock data
      setScrapedTwitterData(scrapedData);
      localStorage.setItem('scrapedTwitterData', JSON.stringify(scrapedData));
      console.log("Stored fallback Twitter data in local storage after error:", scrapedData);
    } finally {
      setIsScrapingTwitter(false);
    }
  };

  const addProduct = async () => {
    if (newProduct.name && newProduct.description) {
        setIsAdding(true);
      try {
        const response = await DataService.addChannel({
          user_id: userId,
          product_id: products.length + 1,
          product_name: newProduct.name,
          description: newProduct.description,
          link: newProduct.link || '',
        });

        if (response.channel) {
          const newChannelData = {
            id: response.channel.id,
            name: response.channel.product_name,
            description: response.channel.description || '',
            link: response.channel.link || '',
          };
          
          setProducts([...products, newChannelData]);
          setNewProduct({ name: '', description: '', link: '' });
          
          // If it's a Twitter link, scrape it
          if (newChannelData.link && 
              (newChannelData.link.includes('twitter.com') || 
               newChannelData.link.includes('x.com'))) {
            scrapeTwitterProfile(newChannelData.link, newChannelData.name);
          }
        }
      } catch (error) {
        console.error('Error adding product:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const removeProduct = async (id: number) => {
    try {
      await DataService.deleteChannel(id);
      
      // Get the product being removed
      const productToRemove = products.find(p => p.id === id);
      
      // Remove from products list
      setProducts(products.filter((product) => product.id !== id));
      
      // If we removed the product that was scraped, clear the scraped data
      if (productToRemove && scrapedTwitterData && 
          scrapedTwitterData.profile_url === productToRemove.link) {
        setScrapedTwitterData(null);
        localStorage.removeItem('scrapedTwitterData');
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const addXChannel = () => {
    if (newXChannel.name && newXChannel.url) {
      setXChannels([...xChannels, { ...newXChannel, id: xChannels.length + 1 }])
      setNewXChannel({ name: "", url: "" })
    }
  }

  const removeXChannel = (id: number) => {
    setXChannels(xChannels.filter((channel) => channel.id !== id))
  }

  const generateScriptIdeas = async (loadMore = false) => {
    if (products.length === 0) {
      console.error("No products available")
      return
    }

    setIsGeneratingIdeas(true)
    try {
      // Get Twitter data if available, otherwise use empty array
      const twitterData = scrapedTwitterData?.tweets || [];
      
      // Limit the number of tweets to 100 to avoid context length issues
      const limitedTweets = twitterData.slice(0, 100);
      
      const response = await DataService.generateScriptIdeas({
        product_name: products[0].name,
        description: products[0].description,
        link: products[0]?.link || "",
        script_idea: textFilter,
        twitter_content: limitedTweets.length > 0 ? { tweets: limitedTweets } : undefined,
      })

      console.log("response", response)

      if (response) {
        const newIdeas: ScriptIdea[] = response.ideas.map((idea: any, index: number) => ({
          id: loadMore ? scriptIdeas.length + index + 1 : index + 1,
          topic: idea.title,
          tweet: idea.content,
        }))
        
        if (loadMore) {
          setScriptIdeas(prevIdeas => [...prevIdeas, ...newIdeas])
        } else {
          setScriptIdeas(newIdeas)
        }
      } else {
        console.error("Failed to generate script ideas")
      }
    } catch (error) {
      console.error("Error generating script ideas:", error)
    } finally {
      setIsGeneratingIdeas(false)
    }
  }

  const handleContentTypeChange = (type: keyof typeof contentTypeFilters) => {
    setContentTypeFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const toggleIdeaExpansion = (id: number) => {
    setExpandedIdeas((prevExpanded) =>
      prevExpanded.includes(id) ? prevExpanded.filter((expandedId) => expandedId !== id) : [...prevExpanded, id],
    )
  }

  const toggleXChannels = () => {
    setShowXChannels(!showXChannels)
  }

  const rateIdea = async (id: number, rating: "up" | "down") => {
    setIdeaRatings((prev) => ({
      ...prev,
      [id]: prev[id] === rating ? null : rating,
    }))

    // If the idea is liked (upvoted), add it to likedIdeas
    if (rating === "up" && ideaRatings[id] !== "up") {
      const idea = scriptIdeas.find(i => i.id === id)
      if (idea) {
        const updatedIdea = {
          ...idea,
          isLiked: true,
          hasVoice: recordingIdea === id
        }
        setLikedIdeas(prev => [...prev, updatedIdea])
      }
    } else if (rating === "down" || (rating === "up" && ideaRatings[id] === "up")) {
      // Remove from likedIdeas if unliked
      setLikedIdeas(prev => prev.filter(idea => idea.id !== id))
    }
  }

  const toggleRecording = async (id: number) => {
    if (recordingIdea === id) {
      // Stop recording
      const recording = await stopRecording();
      try {
        // Transcribe the recording
        const transcript = await transcriptionService.transcribeAudio(recording);
        updateRecordingTranscript(recording.id, transcript);
        
        // Update the idea with the transcript and automatically like it
        setScriptIdeas(prevIdeas => 
          prevIdeas.map(idea => 
            idea.id === id 
              ? { ...idea, hasVoice: true, transcript } 
              : idea
          )
        );
        
        // Automatically like the idea when recording stops
        rateIdea(id, "up");
      } catch (error) {
        console.error('Error transcribing audio:', error);
      }
      setRecordingIdea(null);
    } else {
      // Start recording
      await startRecording();
      setRecordingIdea(id);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (recordingIdea !== null) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [recordingIdea])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    // Format the liked ideas to match the expected structure in generated-scripts
    const formattedScripts = likedIdeas.map(idea => {
      // Find the original idea from scriptIdeas to get the transcript
      const originalIdea = scriptIdeas.find(si => si.id === idea.id);
      return {
        id: idea.id,
        idea_id: uuidv4(), // Generate a new UUID for each script
        idea_title: idea.topic,
        script_title: idea.topic,
        content: idea.tweet,
        is_locked: false,
        isLiked: true,
        hasVoice: idea.hasVoice || false,
        transcript: originalIdea?.transcript || null
      };
    });

    // Store formatted scripts in localStorage
    localStorage.setItem('generatedScripts', JSON.stringify(formattedScripts))
    
    // Navigate to generated-scripts page
    router.push('/generated-scripts')
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
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-10 relative z-10 overflow-y-auto ml-[150px]">
        <LogoutButton />
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white">Welcome back, {username || 'User'}</h1>
          <p className="text-white/70 text-lg mt-2">Generate scripts for your products</p>
          
          {/* Twitter scraping status */}
          {isScrapingTwitter && (
            <div className="mt-2 p-2 bg-blue-500/20 rounded-md">
              <p className="text-blue-300">
                <Twitter className="inline-block mr-2 h-4 w-4 animate-pulse" /> 
                Scraping Twitter profile...
              </p>
            </div>
          )}
          
          {scrapedTwitterData && (
            <div className="mt-2 p-2 bg-blue-500/10 rounded-md">
              <p className="text-blue-300">
                <Twitter className="inline-block mr-2 h-4 w-4" /> 
                Scraped {scrapedTwitterData.articles_scraped} tweets from {scrapedTwitterData.profile_url}
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button and Tables */}
        <div className="flex items-start mb-8">
          {/* X Channels Button */}
          <div className="flex flex-col justify-start items-center mr-4">
            <Button
              variant="outline"
              size="icon"
              className={`${
                showXChannels ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
              } text-white border-none shadow-lg w-12 h-12`}
              title={showXChannels ? "Show Products" : "Show X Channels"}
              onClick={toggleXChannels}
            >
              {showXChannels ? <LayoutDashboard className="h-6 w-6" /> : <Twitter className="h-6 w-6" />}
            </Button>
          </div>

          {/* Product Table or X Channels Table */}
          <div className="bg-[#151F38] rounded-lg p-6 flex-grow shadow-lg">
            {showXChannels ? (
              <>
                <h2 className="text-xl font-semibold mb-4">X Channels</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {xChannels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell>{channel.name}</TableCell>
                        <TableCell>{channel.url}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeXChannel(channel.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Channel Name"
                          value={newXChannel.name}
                          onChange={(e) => setNewXChannel({ ...newXChannel, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Channel URL"
                          value={newXChannel.url}
                          onChange={(e) => setNewXChannel({ ...newXChannel, url: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={addXChannel}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Channels</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.link || "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeProduct(product.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Link (optional)"
                          value={newProduct.link}
                          onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={addProduct} disabled={isAdding}>
                        {isAdding ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add
                            </>
                        )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </div>

        {/* Replace the Button for generating script ideas with this new filter section */}
        <div className="mb-8 bg-[#151F38] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Generate Script Ideas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="text-filter" className="block text-sm font-medium text-white/70 mb-2">
                Enter the topics you want or don't want
              </label>
              <textarea
                id="text-filter"
                placeholder="Example:
I want videos about cooking and gardening
I don't want politics or controversial topics
Include cats and dogs
Exclude violence and adult content"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
                className="w-full h-32 bg-[#0F172A] border-white/10 rounded-md p-2 text-white placeholder-white/50"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-white/70 mb-4">Content Type</p>
              <div className="flex flex-wrap gap-6">
                {Object.entries(contentTypeFilters).map(([type, isChecked]) => (
                  <label key={type} className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleContentTypeChange(type as keyof typeof contentTypeFilters)}
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-full ${
                          isChecked ? "border-purple-500 bg-purple-500" : "border-white/30 bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-white capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={() => generateScriptIdeas(true)} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isGeneratingIdeas}
          >
            {isGeneratingIdeas ? "Generating..." : "Generate Script Ideas"}
          </Button>
        </div>

        {/* Script Ideas */}
        {scriptIdeas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Script Ideas ({scriptIdeas.length})</h2>
            <p className="text-white/70 mb-4">Explore the generated script ideas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scriptIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-lg cursor-pointer transition-colors bg-[#151F38] hover:bg-[#1f2b4d]"
                  onClick={() => toggleIdeaExpansion(idea.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-grow">
                      {expandedIdeas.includes(idea.id) ? (
                        <ChevronUp className="w-5 h-5 text-white mr-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white mr-2" />
                      )}
                      <p className="text-white">{idea.topic}</p>
                    </div>
                  </div>
                  {expandedIdeas.includes(idea.id) && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-white mb-4">{idea.tweet}</p>
                      {idea.transcript && (
                        <div className="mt-2 p-2 bg-gray-800 rounded">
                          <p className="text-sm text-white/80">Transcript:</p>
                          <p className="text-sm text-white">{idea.transcript}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              rateIdea(idea.id, "up")
                            }}
                            className={ideaRatings[idea.id] === "up" ? "text-green-500" : "text-white"}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              rateIdea(idea.id, "down")
                            }}
                            className={ideaRatings[idea.id] === "down" ? "text-red-500" : "text-white"}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRecording(idea.id)
                            }}
                            className={`rounded-full p-2 ${
                              recordingIdea === idea.id ? "bg-red-500 text-white" : "text-white hover:bg-gray-600"
                            }`}
                          >
                            <Mic className="w-4 h-4" />
                          </Button>
                          {recordingIdea === idea.id && (
                            <>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs">
                                {formatTime(recordingTime)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => generateScriptIdeas(true)} 
                className="bg-purple-600 hover:bg-purple-700 text-white mr-4"
                disabled={isGeneratingIdeas}
              >
                {isGeneratingIdeas ? "Loading More..." : "Load More Ideas"}
              </Button>
            </div>
            
            <Button 
              onClick={handleNext} 
              className="bg-purple-600 hover:bg-purple-700 text-white my-6"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
