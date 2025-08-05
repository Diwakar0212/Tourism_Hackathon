import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export interface UserAnalytics {
  userId: string;
  sessionId: string;
  timestamp: Date;
  event: string;
  metadata: Record<string, any>;
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
    city?: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    version: string;
  };
  source: {
    referrer?: string;
    campaign?: string;
    medium?: string;
    source?: string;
  };
}

export interface BusinessMetrics {
  date: string;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
  safetyEvents: number;
  emergencyAlerts: number;
}

export interface TripAnalytics {
  tripId: string;
  userId: string;
  destination: string;
  duration: number; // days
  safetyScore: number;
  checkInFrequency: number;
  emergencyContacts: number;
  costPerDay: number;
  satisfactionRating?: number;
  completionStatus: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface SafetyAnalytics {
  userId: string;
  eventType: 'sos_triggered' | 'check_in_missed' | 'safe_arrival' | 'emergency_contact_added' | 'location_shared';
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  responseTime?: number; // minutes
  metadata: Record<string, any>;
}

export interface RevenueAnalytics {
  date: string;
  subscriptionRevenue: number;
  premiumFeatureRevenue: number;
  partnerCommissions: number;
  totalRevenue: number;
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
  customerLifetimeValue: number;
  acquisitionCost: number;
}

// In-memory storage for analytics (in production, this would be a database)
class AnalyticsStore {
  private userEvents: UserAnalytics[] = [];
  private businessMetrics: BusinessMetrics[] = [];
  private tripAnalytics: TripAnalytics[] = [];
  private safetyEvents: SafetyAnalytics[] = [];
  private revenueData: RevenueAnalytics[] = [];

  // User Analytics Methods
  trackUserEvent(event: UserAnalytics): void {
    this.userEvents.push({
      ...event,
      timestamp: new Date()
    });
  }

  getUserEvents(userId: string, dateRange?: { start: Date; end: Date }): UserAnalytics[] {
    let events = this.userEvents.filter(event => event.userId === userId);
    
    if (dateRange) {
      events = events.filter(event => 
        event.timestamp >= dateRange.start && event.timestamp <= dateRange.end
      );
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Business Metrics Methods
  updateBusinessMetrics(metrics: BusinessMetrics): void {
    const existingIndex = this.businessMetrics.findIndex(m => m.date === metrics.date);
    if (existingIndex >= 0) {
      this.businessMetrics[existingIndex] = metrics;
    } else {
      this.businessMetrics.push(metrics);
    }
  }

  getBusinessMetrics(dateRange: { start: string; end: string }): BusinessMetrics[] {
    return this.businessMetrics
      .filter(metrics => metrics.date >= dateRange.start && metrics.date <= dateRange.end)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Trip Analytics Methods
  addTripAnalytics(trip: TripAnalytics): void {
    const existingIndex = this.tripAnalytics.findIndex(t => t.tripId === trip.tripId);
    if (existingIndex >= 0) {
      this.tripAnalytics[existingIndex] = trip;
    } else {
      this.tripAnalytics.push(trip);
    }
  }

  getTripAnalytics(filters?: {
    userId?: string;
    destination?: string;
    status?: string;
    dateRange?: { start: Date; end: Date };
  }): TripAnalytics[] {
    let trips = [...this.tripAnalytics];

    if (filters?.userId) {
      trips = trips.filter(trip => trip.userId === filters.userId);
    }

    if (filters?.destination) {
      trips = trips.filter(trip => 
        trip.destination.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }

    if (filters?.status) {
      trips = trips.filter(trip => trip.completionStatus === filters.status);
    }

    return trips;
  }

  // Safety Analytics Methods
  addSafetyEvent(event: SafetyAnalytics): void {
    this.safetyEvents.push({
      ...event,
      timestamp: new Date()
    });
  }

  getSafetyEvents(filters?: {
    userId?: string;
    severity?: string;
    eventType?: string;
    dateRange?: { start: Date; end: Date };
  }): SafetyAnalytics[] {
    let events = [...this.safetyEvents];

    if (filters?.userId) {
      events = events.filter(event => event.userId === filters.userId);
    }

    if (filters?.severity) {
      events = events.filter(event => event.severity === filters.severity);
    }

    if (filters?.eventType) {
      events = events.filter(event => event.eventType === filters.eventType);
    }

    if (filters?.dateRange) {
      events = events.filter(event => 
        event.timestamp >= filters.dateRange!.start && 
        event.timestamp <= filters.dateRange!.end
      );
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Revenue Analytics Methods
  addRevenueData(revenue: RevenueAnalytics): void {
    const existingIndex = this.revenueData.findIndex(r => r.date === revenue.date);
    if (existingIndex >= 0) {
      this.revenueData[existingIndex] = revenue;
    } else {
      this.revenueData.push(revenue);
    }
  }

  getRevenueData(dateRange: { start: string; end: string }): RevenueAnalytics[] {
    return this.revenueData
      .filter(revenue => revenue.date >= dateRange.start && revenue.date <= dateRange.end)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Dashboard Summary Methods
  getDashboardSummary(dateRange: { start: string; end: string }) {
    const businessMetrics = this.getBusinessMetrics(dateRange);
    const revenueData = this.getRevenueData(dateRange);
    const safetyEvents = this.getSafetyEvents({
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      }
    });

    const totalRevenue = revenueData.reduce((sum, r) => sum + r.totalRevenue, 0);
    const avgDailyRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

    const totalUsers = businessMetrics.reduce((sum, m) => sum + m.totalUsers, 0);
    const totalSessions = businessMetrics.reduce((sum, m) => sum + m.sessions, 0);
    const avgSessionDuration = businessMetrics.length > 0 
      ? businessMetrics.reduce((sum, m) => sum + m.avgSessionDuration, 0) / businessMetrics.length 
      : 0;

    const criticalSafetyEvents = safetyEvents.filter(e => e.severity === 'critical').length;
    const resolvedSafetyEvents = safetyEvents.filter(e => e.resolved).length;
    const safetyResolutionRate = safetyEvents.length > 0 
      ? (resolvedSafetyEvents / safetyEvents.length) * 100 
      : 0;

    return {
      overview: {
        totalRevenue,
        avgDailyRevenue,
        totalUsers,
        totalSessions,
        avgSessionDuration,
        conversionRate: businessMetrics.length > 0 
          ? businessMetrics.reduce((sum, m) => sum + m.conversionRate, 0) / businessMetrics.length 
          : 0
      },
      safety: {
        totalSafetyEvents: safetyEvents.length,
        criticalEvents: criticalSafetyEvents,
        resolutionRate: safetyResolutionRate,
        avgResponseTime: safetyEvents
          .filter(e => e.responseTime)
          .reduce((sum, e, _, arr) => sum + (e.responseTime! / arr.length), 0)
      },
      trends: {
        revenueGrowth: this.calculateGrowthRate(revenueData.map(r => r.totalRevenue)),
        userGrowth: this.calculateGrowthRate(businessMetrics.map(m => m.totalUsers)),
        safetyTrend: this.calculateTrendDirection(safetyEvents.length)
      }
    };
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return first > 0 ? ((last - first) / first) * 100 : 0;
  }

  private calculateTrendDirection(currentValue: number): 'up' | 'down' | 'stable' {
    // Simplified trend calculation
    return currentValue > 10 ? 'up' : currentValue < 5 ? 'down' : 'stable';
  }
}

// Export singleton instance
export const analyticsStore = new AnalyticsStore();

// Analytics Controller Methods
export class AnalyticsController {
  // Track user event
  static async trackEvent(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, sessionId, event, metadata, location, device, source } = req.body;

      const analyticsEvent: UserAnalytics = {
        userId,
        sessionId,
        event,
        metadata,
        location,
        device,
        source,
        timestamp: new Date()
      };

      analyticsStore.trackUserEvent(analyticsEvent);

      res.status(201).json({
        success: true,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  }

  // Get user analytics
  static async getUserAnalytics(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      let dateRange;
      if (startDate && endDate) {
        dateRange = {
          start: new Date(startDate as string),
          end: new Date(endDate as string)
        };
      }

      const events = analyticsStore.getUserEvents(userId, dateRange);

      res.json({
        success: true,
        data: {
          userId,
          totalEvents: events.length,
          events: events.slice(0, 100), // Limit to 100 recent events
          summary: {
            uniqueSessions: [...new Set(events.map(e => e.sessionId))].length,
            topEvents: events.reduce((acc, event) => {
              acc[event.event] = (acc[event.event] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          }
        }
      });
    } catch (error) {
      console.error('Error getting user analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user analytics'
      });
    }
  }

  // Get business dashboard
  static async getDashboard(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      const dateRange = {
        start: startDate as string || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: endDate as string || new Date().toISOString().split('T')[0]
      };

      const dashboard = analyticsStore.getDashboardSummary(dateRange);

      res.json({
        success: true,
        data: {
          dateRange,
          ...dashboard
        }
      });
    } catch (error) {
      console.error('Error getting dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data'
      });
    }
  }

  // Track safety event
  static async trackSafetyEvent(req: Request, res: Response) {
    try {
      const { userId, eventType, location, severity, metadata } = req.body;

      const safetyEvent: SafetyAnalytics = {
        userId,
        eventType,
        location,
        severity,
        metadata,
        resolved: false,
        timestamp: new Date()
      };

      analyticsStore.addSafetyEvent(safetyEvent);

      res.status(201).json({
        success: true,
        message: 'Safety event tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking safety event:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track safety event'
      });
    }
  }

  // Get safety analytics
  static async getSafetyAnalytics(req: Request, res: Response) {
    try {
      const { severity, eventType, startDate, endDate } = req.query;

      let dateRange;
      if (startDate && endDate) {
        dateRange = {
          start: new Date(startDate as string),
          end: new Date(endDate as string)
        };
      }

      const events = analyticsStore.getSafetyEvents({
        severity: severity as string,
        eventType: eventType as string,
        dateRange
      });

      const summary = {
        totalEvents: events.length,
        bySeverity: events.reduce((acc, event) => {
          acc[event.severity] = (acc[event.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byType: events.reduce((acc, event) => {
          acc[event.eventType] = (acc[event.eventType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        resolutionRate: events.length > 0 
          ? (events.filter(e => e.resolved).length / events.length) * 100 
          : 0
      };

      res.json({
        success: true,
        data: {
          summary,
          events: events.slice(0, 50) // Limit recent events
        }
      });
    } catch (error) {
      console.error('Error getting safety analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get safety analytics'
      });
    }
  }
}
