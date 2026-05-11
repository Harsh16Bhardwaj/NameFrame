/**
 * Dashboard Analytics Utilities
 * Centralized calculations for event, participant, certificate, and email analytics
 */

interface EventData {
  id: string;
  title: string;
  createdAt: Date;
  participants: ParticipantData[];
}

interface ParticipantData {
  id: string;
  name: string;
  email: string;
  emailed: boolean;
  emailStatus?: string;
  participated?: boolean;
  createdAt?: Date;
}

// ============ EVENT ANALYTICS ============

export const getTotalEvents = (events: EventData[]): number => {
  return events.length;
};

export const getEventsThisMonth = (events: EventData[]): number => {
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
  return events.filter((e) => new Date(e.createdAt) >= monthAgo).length;
};

export const getHighestParticipationEvent = (
  events: EventData[]
): EventData | null => {
  if (events.length === 0) return null;
  return events.reduce((max, event) =>
    event.participants.length > max.participants.length ? event : max
  );
};

export const getLowestParticipationEvent = (
  events: EventData[]
): EventData | null => {
  if (events.length === 0) return null;
  return events.reduce((min, event) =>
    event.participants.length < min.participants.length ? event : min
  );
};

export const getAverageParticipantsPerEvent = (events: EventData[]): number => {
  if (events.length === 0) return 0;
  const totalParticipants = events.reduce(
    (sum, event) => sum + event.participants.length,
    0
  );
  return Math.round(totalParticipants / events.length);
};

// ============ PARTICIPANT ANALYTICS ============

export const getUniqueParticipantsByEmail = (events: EventData[]): string[] => {
  const emails = new Set<string>();
  events.forEach((event) => {
    event.participants.forEach((p) => {
      emails.add(p.email.toLowerCase());
    });
  });
  return Array.from(emails);
};

export const getUniqueParticipantCount = (events: EventData[]): number => {
  return getUniqueParticipantsByEmail(events).length;
};

export const getRepeatParticipants = (events: EventData[]): string[] => {
  const emailCounts = new Map<string, number>();
  events.forEach((event) => {
    event.participants.forEach((p) => {
      const email = p.email.toLowerCase();
      emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
    });
  });
  return Array.from(emailCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([email]) => email);
};

export const getRepeatParticipantCount = (events: EventData[]): number => {
  return getRepeatParticipants(events).length;
};

export const getRepeatParticipantPercentage = (events: EventData[]): number => {
  const unique = getUniqueParticipantCount(events);
  if (unique === 0) return 0;
  const repeat = getRepeatParticipantCount(events);
  return Math.round((repeat / unique) * 100);
};

export const getMostFrequentParticipants = (
  events: EventData[],
  limit: number = 5
): Array<{ email: string; count: number; name?: string }> => {
  const participantMap = new Map<
    string,
    { count: number; name?: string; email: string }
  >();

  events.forEach((event) => {
    event.participants.forEach((p) => {
      const email = p.email.toLowerCase();
      const existing = participantMap.get(email);
      participantMap.set(email, {
        count: (existing?.count || 0) + 1,
        name: p.name,
        email: p.email,
      });
    });
  });

  return Array.from(participantMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ count, email, name }) => ({ count, email, name }));
};

export const getParticipantOverlapBetweenEvents = (
  events: EventData[]
): Map<string, number> => {
  const overlapMap = new Map<string, number>();

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1Emails = new Set(
        events[i].participants.map((p) => p.email.toLowerCase())
      );
      const event2Emails = new Set(
        events[j].participants.map((p) => p.email.toLowerCase())
      );

      let overlap = 0;
      event1Emails.forEach((email) => {
        if (event2Emails.has(email)) overlap++;
      });

      if (overlap > 0) {
        const key = `${events[i].title} ↔ ${events[j].title}`;
        overlapMap.set(key, overlap);
      }
    }
  }

  return overlapMap;
};

// ============ CERTIFICATE ANALYTICS ============

export const getCertificatesGeneratedCount = (events: EventData[]): number => {
  // Assuming all participants have certificates generated
  return events.reduce((sum, e) => sum + e.participants.length, 0);
};

export const getCertificateCompletionRate = (events: EventData[]): number => {
  // If certificates are generated per participant, completion is 100% when they exist
  return events.length > 0 && getCertificatesGeneratedCount(events) > 0 ? 100 : 0;
};

// ============ EMAIL ANALYTICS ============

export const getTotalEmailsSent = (events: EventData[]): number => {
  return events.reduce(
    (sum, event) => sum + event.participants.filter((p) => p.emailed).length,
    0
  );
};

export const getPendingEmailsCount = (events: EventData[]): number => {
  return events.reduce(
    (sum, event) =>
      sum +
      event.participants.filter((p) => !p.emailed && p.emailStatus === "PENDING")
        .length,
    0
  );
};

export const getFailedEmailsCount = (events: EventData[]): number => {
  return events.reduce(
    (sum, event) =>
      sum +
      event.participants.filter((p) => p.emailStatus === "FAILED").length,
    0
  );
};

export const getEmailSuccessRate = (events: EventData[]): number => {
  const total = events.reduce((sum, e) => sum + e.participants.length, 0);
  if (total === 0) return 0;
  const sent = getTotalEmailsSent(events);
  return Math.round((sent / total) * 100);
};

// ============ INSIGHT GENERATION ============

export interface DashboardInsight {
  id: string;
  text: string;
  category: "positive" | "neutral" | "warning" | "critical";
  icon: string;
}

export const generateSmartInsights = (events: EventData[]): DashboardInsight[] => {
  const insights: DashboardInsight[] = [];

  if (events.length === 0) {
    insights.push({
      id: "no-events",
      text: "Create your first event to unlock dashboard insights.",
      category: "neutral",
      icon: "calendar",
    });
    return insights;
  }

  // Participant insights
  const unique = getUniqueParticipantCount(events);
  const repeat = getRepeatParticipantCount(events);
  const repeatPct = getRepeatParticipantPercentage(events);

  if (repeat > 0) {
    insights.push({
      id: "repeat-participants",
      text: `${repeatPct}% of participants (${repeat} people) attended more than one event.`,
      category: "positive",
      icon: "users",
    });
  }

  // Most frequent participant
  const mostFrequent = getMostFrequentParticipants(events, 1);
  if (mostFrequent.length > 0) {
    insights.push({
      id: "most-frequent",
      text: `${mostFrequent[0].name || mostFrequent[0].email} attended the most events (${mostFrequent[0].count} times).`,
      category: "positive",
      icon: "star",
    });
  }

  // Email success
  const emailSuccessRate = getEmailSuccessRate(events);
  if (emailSuccessRate < 80 && emailSuccessRate > 0) {
    insights.push({
      id: "low-email-success",
      text: `Email success rate is ${emailSuccessRate}%. Consider reviewing failed deliveries.`,
      category: "warning",
      icon: "alert",
    });
  } else if (emailSuccessRate >= 90) {
    insights.push({
      id: "high-email-success",
      text: `Excellent! ${emailSuccessRate}% of emails were delivered successfully.`,
      category: "positive",
      icon: "check",
    });
  }

  // Event participation trend
  const avg = getAverageParticipantsPerEvent(events);
  if (events.length > 1) {
    const latest = events[0].participants.length;
    const previous = events[1].participants.length;
    const change = ((latest - previous) / previous) * 100;

    if (change < -15) {
      insights.push({
        id: "participation-drop",
        text: `Participation dropped ${Math.abs(Math.round(change))}% in the latest event.`,
        category: "warning",
        icon: "trend-down",
      });
    } else if (change > 15) {
      insights.push({
        id: "participation-spike",
        text: `Participation spiked ${Math.round(change)}% in the latest event!`,
        category: "positive",
        icon: "trend-up",
      });
    }
  }

  // Pending emails
  const pending = getPendingEmailsCount(events);
  if (pending > 0) {
    insights.push({
      id: "pending-emails",
      text: `${pending} email(s) are still pending delivery.`,
      category: "warning",
      icon: "clock",
    });
  }

  // Failed emails
  const failed = getFailedEmailsCount(events);
  if (failed > 0) {
    insights.push({
      id: "failed-emails",
      text: `${failed} email(s) failed delivery and need attention.`,
      category: "critical",
      icon: "x",
    });
  }

  return insights;
};

// ============ SUMMARY METRICS ============

export interface DashboardMetrics {
  totalEvents: number;
  uniqueParticipants: number;
  repeatParticipants: number;
  totalCertificates: number;
  emailsSent: number;
  emailsPending: number;
  emailsFailed: number;
  emailSuccessRate: number;
  averageParticipantsPerEvent: number;
}

export const calculateDashboardMetrics = (
  events: EventData[]
): DashboardMetrics => {
  return {
    totalEvents: getTotalEvents(events),
    uniqueParticipants: getUniqueParticipantCount(events),
    repeatParticipants: getRepeatParticipantCount(events),
    totalCertificates: getCertificatesGeneratedCount(events),
    emailsSent: getTotalEmailsSent(events),
    emailsPending: getPendingEmailsCount(events),
    emailsFailed: getFailedEmailsCount(events),
    emailSuccessRate: getEmailSuccessRate(events),
    averageParticipantsPerEvent: getAverageParticipantsPerEvent(events),
  };
};
