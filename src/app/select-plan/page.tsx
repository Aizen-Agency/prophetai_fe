'use client'

import React, { useState } from 'react';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { FaQuestionCircle } from 'react-icons/fa';
import { useLogin } from '@/context/LoginContext';
import { useRouter } from 'next/navigation';

interface Feature {
  text: string;
  included: boolean;
  help?: boolean;
}

interface Plan {
  title: string;
  description: string;
  yearlyPrice: number;
  monthlyPrice: number;
  yearlyPriceId: string;
  monthlyPriceId: string;
  color: string;
  features: Feature[];
}

interface PricingPlanProps {
  title: string;
  description: string;
  price: number;
  features: Feature[];
  color: string;
  disabled?: boolean;
  onGetAccess: () => void;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ 
  title, 
  description, 
  price, 
  features, 
  color, 
  disabled, 
  onGetAccess 
}) => (
  <div className={`flex flex-col p-6 rounded-[30px] border ${color} ${disabled ? 'opacity-70' : ''} h-full`}>
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-sm mb-4">{description}</p>
    <p className="text-3xl font-bold mb-6">
      {title === "Enterprise" ? "Contact Us" : (
        <>${price}<span className="text-sm font-normal">/month</span></>
      )}
    </p>
    
    {features.map((feature, index) => (
      <div key={index} className="flex items-center mb-2 flex-grow">
        {feature.included ? 
          <AiFillCheckCircle className="w-6 h-6 mr-2 text-green-500 flex-shrink-0" /> :
          <AiFillCloseCircle className="w-6 h-6 mr-2 text-red-500 flex-shrink-0" />
        }
        <span className={`${feature.included ? '' : 'line-through'} whitespace-normal`}>{feature.text}</span>
        {feature.help && <FaQuestionCircle className="w-4 h-4 ml-1 text-gray-400" />}
      </div>
    ))}
    <button 
      className={`mt-6 py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 ${color === 'bg-purple-600' ? 'bg-gradient-to-r from-black to-gray-800 text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'}`}
      onClick={onGetAccess}
    >
      Get Access
    </button>
  </div>
);

export default function SelectPlanPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { isLoggedIn } = useLogin();
  const router = useRouter();

  const plans = [
    {
      title: "Individual",
      description: "Best for individual enterprise",
      yearlyPrice: 192.99,
      monthlyPrice: 19.99,
      yearlyPriceId: "price_1QH8TX02khdf3R0AlBJjp5Ll",
      monthlyPriceId: "price_1QH8TX02khdf3R0AJUTGTXIR",
      color: "bg-gray-800 text-white",
      features: [
        { text: "100 Minutes Included", included: true },
        { text: "$0.20/Additional Minute", included: true },
        { text: "1 US Phone Number", included: true },
        { text: "1 Agent Included*", included: true, help: true },
        { text: "Basic Support", included: true },
        { text: "API Access", included: true },
        { text: "White Labeling (10 Subaccounts)", included: false },
        { text: "Custom Integrations", included: false },
      ],
    },
    {
      title: "Agency",
      description: "Perfect for agencies and growing businesses",
      yearlyPrice: 2399.99,
      monthlyPrice: 249.99,
      yearlyPriceId: "price_1QH8VF02khdf3R0AnAjoGqGy",
      monthlyPriceId: "price_1QH8UP02khdf3R0AfcfXmAoR",
      color: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
      features: [
        { text: "600 Minutes Included", included: true },
        { text: "$0.18/Additional Minute", included: true },
        { text: "3 US Phone Numbers", included: true },
        { text: "3 Agents Included*", included: true, help: true },
        { text: "Priority Support", included: true },
        { text: "API Access", included: true },
        { text: "White Labeling (10 Subaccounts)", included: true },
        { text: "Custom Integrations", included: true },
      ],
    },
    {
      title: "Enterprise",
      description: "Best for large enterprises",
      yearlyPrice: 0,
      monthlyPrice: 0,
      yearlyPriceId: "",
      monthlyPriceId: "",
      color: "bg-gray-800 text-white",
      features: [
        { text: "Unlimited Minutes", included: true },
        { text: "Custom Minute Rates", included: true },
        { text: "Unlimited Phone Numbers", included: true },
        { text: "Unlimited Agents", included: true },
        { text: "24/7 Priority Support", included: true },
        { text: "API Access", included: true },
        { text: "White Labeling (Unlimited Subaccounts)", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Custom SLA", included: true },
        { text: "Dedicated Account Manager", included: true },
      ],
    },
  ];

  const helpText = "*Additional agents can be added for $100/month each";

  const handleGetAccess = (plan: Plan) => {
    if (plan.title === "Enterprise") {
      window.open('https://calendly.com/ericd3770/30min', '_blank');
      return;
    }

    if (isLoggedIn) {
      router.push(`/checkout?plan=${encodeURIComponent(JSON.stringify({
        ...plan,
        price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
        priceId: isYearly ? plan.yearlyPriceId : plan.monthlyPriceId,
        interval: isYearly ? 'yearly' : 'monthly'
      }))}`)
    } else {
      router.push('/expert-signup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col items-center gap-6 p-6 text-white font-[Poppins]">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Pricing</h1>
          <div className="flex items-center bg-gray-800 rounded-full p-1">
            <span 
              className={`px-4 py-2 rounded-full cursor-pointer ${!isYearly ? 'bg-purple-600' : ''}`} 
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </span>
            <div 
              className="w-14 h-8 bg-gray-700 rounded-full p-1 cursor-pointer" 
              onClick={() => setIsYearly(!isYearly)}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${isYearly ? 'translate-x-6' : ''}`} />
            </div>
            <span 
              className={`px-4 py-2 rounded-full cursor-pointer ${isYearly ? 'bg-purple-600' : ''}`} 
              onClick={() => setIsYearly(true)}
            >
              Yearly (Save 20%)
            </span>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1400px] px-4 md:px-6 lg:px-8'>
          {plans.map((plan, index) => (
            <PricingPlan 
              key={index} 
              {...plan} 
              price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              title={plan.title === "Enterprise" ? plan.title : `${plan.title} (${isYearly ? 'yearly' : 'monthly'})`}
              onGetAccess={() => handleGetAccess(plan)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 