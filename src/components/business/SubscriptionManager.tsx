import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Crown,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan?: SubscriptionPlan;
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'safety' | 'travel' | 'analytics' | 'premium';
  oneTime: boolean;
  requiresSubscription?: string;
}

const SubscriptionManager: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlansAndFeatures();
    fetchUserSubscription();
  }, []);

  const fetchPlansAndFeatures = async () => {
    try {
      const response = await fetch('/api/business/plans');
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.data.plans);
        setFeatures(data.data.features);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Mock data for demonstration
      setPlans([
        {
          id: 'basic',
          name: 'SafeSolo Basic',
          description: 'Essential safety features for solo travelers',
          price: 999,
          currency: 'usd',
          interval: 'month',
          features: [
            'Emergency SOS alerts',
            'Basic location sharing',
            'Emergency contacts (up to 3)',
            'Safety check-ins',
            'Basic trip planning'
          ]
        },
        {
          id: 'premium',
          name: 'SafeSolo Premium',
          description: 'Advanced safety and travel features',
          price: 1999,
          currency: 'usd',
          interval: 'month',
          popular: true,
          features: [
            'All Basic features',
            'Real-time location tracking',
            'Unlimited emergency contacts',
            'Advanced safety analytics',
            'Trip recommendations',
            'Offline emergency features',
            '24/7 emergency support',
            'Travel insurance integration'
          ]
        },
        {
          id: 'enterprise',
          name: 'SafeSolo Enterprise',
          description: 'Complete solution for travel organizations',
          price: 4999,
          currency: 'usd',
          interval: 'month',
          features: [
            'All Premium features',
            'Multi-user management',
            'Custom safety protocols',
            'Advanced analytics dashboard',
            'API access',
            'White-label options',
            'Dedicated account manager',
            'Custom integrations'
          ]
        }
      ]);

      setFeatures([
        {
          id: 'emergency_ai_assistant',
          name: 'AI Emergency Assistant',
          description: 'AI-powered emergency guidance and support',
          price: 499,
          category: 'safety',
          oneTime: false,
          requiresSubscription: 'premium'
        },
        {
          id: 'travel_insurance',
          name: 'Integrated Travel Insurance',
          description: 'Comprehensive travel insurance coverage',
          price: 2999,
          category: 'travel',
          oneTime: true
        },
        {
          id: 'priority_support',
          name: '24/7 Priority Support',
          description: 'Immediate response for emergency situations',
          price: 999,
          category: 'premium',
          oneTime: false,
          requiresSubscription: 'basic'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      // Replace with actual user ID from auth context
      const userId = 'user_test_123';
      const response = await fetch(`/api/business/subscription/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data.subscription) {
        setUserSubscription(data.data.subscription);
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setProcessing(true);
    setSelectedPlan(planId);

    try {
      // In a real implementation, you would:
      // 1. Create Stripe payment method
      // 2. Call your API to create subscription
      // 3. Handle 3D secure if needed
      
      console.log('Subscribing to plan:', planId);
      
      // Mock successful subscription
      setTimeout(() => {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
          setUserSubscription({
            userId: 'user_test_123',
            planId: planId,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
            plan
          });
        }
        setProcessing(false);
        setSelectedPlan(null);
      }, 2000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleCancelSubscription = async (immediate: boolean = false) => {
    if (!userSubscription) return;

    setProcessing(true);

    try {
      const response = await fetch(`/api/business/subscription/${userSubscription.userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ immediate })
      });

      const data = await response.json();
      
      if (data.success) {
        if (immediate) {
          setUserSubscription(null);
        } else {
          setUserSubscription({
            ...userSubscription,
            cancelAtPeriodEnd: true
          });
        }
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price / 100);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Shield className="h-8 w-8 text-blue-500" />;
      case 'premium':
        return <Zap className="h-8 w-8 text-purple-500" />;
      case 'enterprise':
        return <Crown className="h-8 w-8 text-gold-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your SafeSolo Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay safe while traveling solo with our comprehensive safety and travel features.
            Upgrade anytime to access premium features.
          </p>
        </div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getPlanIcon(userSubscription.planId)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Current Plan: {userSubscription.plan?.name || userSubscription.planId}
                    </h3>
                    <p className="text-gray-600">
                      Status: <span className={`font-medium ${
                        userSubscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {userSubscription.status.charAt(0).toUpperCase() + userSubscription.status.slice(1)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {userSubscription.cancelAtPeriodEnd ? 'Cancels' : 'Renews'} on{' '}
                      {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {userSubscription.status === 'active' && !userSubscription.cancelAtPeriodEnd && (
                    <button
                      onClick={() => handleCancelSubscription(false)}
                      disabled={processing}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Cancel at Period End
                    </button>
                  )}
                  
                  {userSubscription.cancelAtPeriodEnd && (
                    <button
                      onClick={() => setUserSubscription({...userSubscription, cancelAtPeriodEnd: false})}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-teal-500 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  {getPlanIcon(plan.id)}
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-600 ml-1">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processing || (userSubscription?.planId === plan.id && userSubscription.status === 'active')}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    userSubscription?.planId === plan.id && userSubscription.status === 'active'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : userSubscription?.planId === plan.id && userSubscription.status === 'active' ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Add-ons</h2>
            <p className="text-lg text-gray-600">
              Enhance your SafeSolo experience with these premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  <span className="text-2xl font-bold text-teal-600">
                    {formatPrice(feature.price)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feature.category === 'safety' ? 'bg-red-100 text-red-700' :
                      feature.category === 'travel' ? 'bg-blue-100 text-blue-700' :
                      feature.category === 'analytics' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {feature.category}
                    </span>
                    {feature.oneTime && (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        One-time
                      </span>
                    )}
                  </div>
                  
                  <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors">
                    Add Feature
                  </button>
                </div>

                {feature.requiresSubscription && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-700">
                      Requires {feature.requiresSubscription} subscription
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600 mb-4">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated 
                and reflected in your next billing cycle.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h3>
              <p className="text-gray-600">
                You can cancel anytime. Your subscription will remain active until the end of your 
                current billing period, and you'll continue to have access to all features.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600 mb-4">
                Yes, we use Stripe for secure payment processing. Your payment information is encrypted 
                and never stored on our servers.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all subscription plans. Contact our support 
                team if you're not satisfied with your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Need help choosing the right plan?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center">
              Contact our sales team
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
