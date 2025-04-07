import React from 'react'

import './styles.css';

interface Review {
  name: string;
  role: string;
  comment: string;
  rating: number;
}

const Reviews = () => {
  const reviews: Review[] = [
    {
      name: "Sarah Johnson",
      role: "Co-founder of Monday",
      comment: "Scalable has transformed how we manage our analytics and sales. The unified dashboard is a game-changer!",
      rating: 5
    },
    {
      name: "Chris Wright",
      role: "CEO of Wednesday",
      comment: "Scalable's CRM integration makes managing customer data effortless. It's incredibly user-friendly.",
      rating: 5
    },
    {
      name: "Sarah Yanna",
      role: "Director of Saturday",
      comment: "The advanced analytics feature helped us identify key trends and boost our sales strategy.",
      rating: 5
    },
    {
      name: "Jonathan Day",
      role: "Co-founder of Monday",
      comment: "With Scalable, our reporting process is seamless and efficient. Automated reports save us so much time!",
      rating: 5
    },
    {
      name: "Melissa Reid",
      role: "Founder of Tuesday",
      comment: "Real-time notifications ensure we're always on top of our sales activities. Highly recommend!",
      rating: 5
    },
    {
      name: "Terri Williams",
      role: "Founder of Thursday",
      comment: "The customizable dashboards allow us to focus on what matters most to our business.",
      rating: 5
    },
    {
      name: "Alex Chen",
      role: "Director of Friday",
      comment: "The predictive analytics feature has revolutionized our forecasting accuracy.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "CEO of Sunday",
      comment: "Scalable's integration capabilities have streamlined our entire workflow.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Founder of Saturday",
      comment: "The AI-powered insights have helped us make better business decisions.",
      rating: 5
    },
  ];

  return (
    <section className="bg-black text-white py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <p className="text-sm uppercase tracking-wider mb-4 text-gray-400">Customer Stories</p>
          <h2 className="text-6xl font-serif mb-6">
            Scale faster <span className="font-serif italic">than ever.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Scalable isn't another fancy piece of software.<br />
            It's engineered to make a difference.
          </p>
        </div>

        <div className="reviews-container">
          <div className="flex gap-6 absolute inset-0">
            {/* Left Column - Scrolling Down */}
            <div className="flex-1 relative">
              <div className="flex flex-col gap-6 absolute inset-x-0">
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-down">
                  {[...reviews.slice(0, 3), ...reviews.slice(0, 3)].map((review, index) => (
                    <ReviewCard key={`col1-${index}`} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-down-delayed">
                  {[...reviews.slice(0, 3), ...reviews.slice(0, 3)].map((review, index) => (
                    <ReviewCard key={`col1-delayed-${index}`} review={review} />
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Scrolling Up */}
            <div className="flex-1 relative">
              <div className="flex flex-col gap-6 absolute inset-x-0">
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-up">
                  {[...reviews.slice(3, 6), ...reviews.slice(3, 6)].map((review, index) => (
                    <ReviewCard key={`col2-${index}`} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-up-delayed">
                  {[...reviews.slice(3, 6), ...reviews.slice(3, 6)].map((review, index) => (
                    <ReviewCard key={`col2-delayed-${index}`} review={review} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Scrolling Down */}
            <div className="flex-1 relative">
              <div className="flex flex-col gap-6 absolute inset-x-0">
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-down">
                  {[...reviews.slice(6, 9), ...reviews.slice(6, 9)].map((review, index) => (
                    <ReviewCard key={`col3-${index}`} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-6 absolute inset-x-0 scroll-column-down-delayed">
                  {[...reviews.slice(6, 9), ...reviews.slice(6, 9)].map((review, index) => (
                    <ReviewCard key={`col3-delayed-${index}`} review={review} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Extract the review card to a separate component for cleaner code
const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10">
    <div className="flex items-center space-x-1 mb-4">
      {[...Array(review.rating)].map((_, i) => (
        <span key={i} className="text-yellow-400">★</span>
      ))}
    </div>
    <p className="text-gray-300 text-lg mb-6">"{review.comment}"</p>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
      <div>
        <p className="font-medium text-white">{review.name}</p>
        <p className="text-sm text-gray-400">{review.role}</p>
      </div>
    </div>
  </div>
);

export default Reviews;