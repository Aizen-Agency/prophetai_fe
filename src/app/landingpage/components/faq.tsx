'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-wider">FAQs</p>
          <h2 className="text-4xl md:text-5xl font-light">
            You asked,{""}
            <span className="italic">we answered.</span>
          </h2>
          <p className="text-gray-400">
            Still got questions? Feel free to reach out to
            <br />
            our incredible support team, 7 days a week.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left">What is VoiceAI, and how can it help my business?</span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              VoiceAI is an all-in-one AI voice platform designed to streamline your audio content creation process. It provides
              comprehensive voice synthesis, advanced customization, and seamless integration to help you create natural-sounding
              voiceovers and boost productivity.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              Can I integrate VoiceAI with my existing tools?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Yes, VoiceAI offers extensive integration capabilities with popular content creation tools, DAWs, and workflow automation platforms. Our API also allows for custom integrations to suit your specific needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              What is the difference between the Standard and Pro plans?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              While both plans offer our core voice synthesis technology, the Pro plan includes additional features such as priority processing, advanced voice customization options, and higher usage limits.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              How secure is my data with VoiceAI?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              We take security seriously. All data is encrypted both in transit and at rest, and we comply with industry-standard security protocols. Your voice data and content are never shared or used without your explicit permission.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              Can I customize the voices to suit my business needs?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Yes, VoiceAI offers extensive voice customization options. You can adjust parameters like tone, pace, emphasis, and emotion to create the perfect voice for your brand or specific use case.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg px-6 border-gray-800">
            <AccordionTrigger className="hover:no-underline">
              Do you offer customer support if I encounter any issues?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Yes, we provide comprehensive customer support through multiple channels. Our dedicated support team is available 7 days a week to help you with any questions or technical issues you may encounter.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}