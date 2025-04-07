'use client'

import { Mic, Wand2, Brain, Zap, Layers, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WhatWeDoComponent() {
  const features = [
    {
      icon: <Mic className="h-8 w-8 mb-2 text-primary" />,
      title: "AI Voice Calling",
      description: "Make automated calls that sound natural and human-like, perfect for customer engagement and support."
    },
    {
      icon: <Wand2 className="h-8 w-8 mb-2 text-primary" />,
      title: "Voice Synthesis",
      description: "Create natural-sounding voices for various applications, from virtual assistants to audiobook narration."
    },
    {
      icon: <Brain className="h-8 w-8 mb-2 text-primary" />,
      title: "Natural Language Processing",
      description: "Understand context, sentiment, and intent behind spoken words for more intelligent interactions."
    },
    {
      icon: <Zap className="h-8 w-8 mb-2 text-primary" />,
      title: "Real-time Voice Analytics",
      description: "Gain insights from voice data, including emotion detection and speaker identification."
    },
    {
      icon: <Layers className="h-8 w-8 mb-2 text-primary" />,
      title: "Multi-platform Integration",
      description: "Seamlessly integrate our voice AI technology into your existing applications and systems."
    },
    {
      icon: <Lock className="h-8 w-8 mb-2 text-primary" />,
      title: "Secure Voice Authentication",
      description: "Implement biometric security using unique voiceprints for user authentication."
    }
  ]

  return (
    <section id="what-we-do" className="relative py-16 bg-gradient-to-b from-black to-[#121218] z-10">
      {/* <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-0"></div> */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">What We Do</h2>
        <p className="text-xl text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          At Wavii, we're revolutionizing customer communication through AI-powered voice technology. 
          Our intelligent calling system makes customer engagement effortless and natural.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-[#121218] border-gray-800"
            >
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center text-white">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}