import { useEffect, useCallback } from 'react';
import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

const useBookingAnalytics = () => {
  const trackBookingEvent = useCallback(async (eventName, eventData = {}) => {
    try {
      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, eventName, {
          ...eventData,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, []);

  const trackBookingView = useCallback((source) => {
    trackBookingEvent('view_booking_page', { source });
  }, [trackBookingEvent]);

  const trackBookingStart = useCallback((consultationType) => {
    trackBookingEvent('begin_booking', { consultationType });
  }, [trackBookingEvent]);

  const trackBookingComplete = useCallback((bookingDetails) => {
    trackBookingEvent('complete_booking', bookingDetails);
  }, [trackBookingEvent]);

  const trackBookingAbandoned = useCallback((step, reason) => {
    trackBookingEvent('abandon_booking', { step, reason });
  }, [trackBookingEvent]);

  const trackConsultationTypeSelected = useCallback((type, price) => {
    trackBookingEvent('select_consultation_type', { type, price });
  }, [trackBookingEvent]);

  const trackTimeSlotSelected = useCallback((timeSlot, consultationType) => {
    trackBookingEvent('select_time_slot', { timeSlot, consultationType });
  }, [trackBookingEvent]);

  return {
    trackBookingView,
    trackBookingStart,
    trackBookingComplete,
    trackBookingAbandoned,
    trackConsultationTypeSelected,
    trackTimeSlotSelected,
  };
};

export default useBookingAnalytics;
