import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MapPin, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { cn } from '../../utils/styles';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  destination: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  images?: string[];
  verified: boolean;
  tripType: 'solo' | 'group' | 'family';
  safetyRating: number;
  accessibilityRating: number;
}

interface CommunityReviewsProps {
  className?: string;
}

const CommunityReviews: React.FC<CommunityReviewsProps> = ({ className }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Sample reviews data - in a real app, this would come from an API
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      destination: 'Goa, India',
      rating: 5,
      title: 'Amazing solo trip experience!',
      content: 'SafeSolo made my first solo trip to Goa incredibly safe and enjoyable. The safety features and local recommendations were spot on. The women-only transport options were a game-changer!',
      date: '2024-01-15',
      likes: 24,
      verified: true,
      tripType: 'solo',
      safetyRating: 5,
      accessibilityRating: 4
    },
    {
      id: '2',
      userName: 'Priya Sharma',
      destination: 'Kerala, India',
      rating: 4,
      title: 'Great accessibility features',
      content: 'As someone who uses a wheelchair, I was impressed by how detailed the accessibility information was. The routes suggested were perfect and the community verification system is brilliant.',
      date: '2024-01-12',
      likes: 18,
      verified: true,
      tripType: 'solo',
      safetyRating: 4,
      accessibilityRating: 5
    },
    {
      id: '3',
      userName: 'Emily Chen',
      destination: 'Rajasthan, India',
      rating: 5,
      title: 'Felt safe throughout my journey',
      content: 'The real-time safety updates and emergency contact features gave me peace of mind. The cultural insights from the AI assistant were incredibly helpful too!',
      date: '2024-01-10',
      likes: 31,
      verified: true,
      tripType: 'solo',
      safetyRating: 5,
      accessibilityRating: 4
    }
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentReviewIndex];

  const StarRating = ({ rating, className: starClassName = "" }: { rating: number; className?: string }) => (
    <div className={cn("flex items-center space-x-1", starClassName)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating ? "text-yellow-400 fill-current" : "text-secondary-300"
          )}
        />
      ))}
    </div>
  );

  return (
    <section className={cn("py-16 bg-gradient-to-br from-primary-50 to-accent-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Real experiences from women and differently-abled travelers who have explored the world safely with SafeSolo
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentReviewIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                {/* User Info */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="font-semibold text-secondary-900">{currentReview.userName}</h4>
                    {currentReview.verified && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <MapPin className="h-4 w-4 text-secondary-500" />
                      <span className="text-secondary-700 font-medium">{currentReview.destination}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <StarRating rating={currentReview.rating} />
                      <span className="text-sm text-secondary-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(currentReview.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {currentReview.title}
                  </h3>
                  
                  <p className="text-secondary-700 leading-relaxed mb-4">
                    {currentReview.content}
                  </p>

                  {/* Rating Details */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600">Safety:</span>
                      <StarRating rating={currentReview.safetyRating} className="scale-75" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600">Accessibility:</span>
                      <StarRating rating={currentReview.accessibilityRating} className="scale-75" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                      {currentReview.tripType} travel
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{currentReview.likes} helpful</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevReview}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    index === currentReviewIndex 
                      ? "bg-primary-500 scale-125" 
                      : "bg-secondary-300 hover:bg-secondary-400"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextReview}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-secondary-600 mb-6">
            Join thousands of travelers sharing their experiences
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
          >
            Share Your Review
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityReviews;
