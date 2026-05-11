import { prisma } from "@/lib/db";
import { buildParticipantCertificate } from "@/lib/certificate/pipeline";
import { generateCertificateEmail } from "@/app/api/send-email/emailTemplate";
import { sendWithProviderFallback } from "@/lib/delivery/providers";
import { mapFailureCode } from "@/lib/delivery/error-codes";
import {
  DeliveryJobStatus,
  DeliveryMode,
  DeliveryQueueEventStatus,
  DeliveryQueueItemStatus,
  DeliveryQueueTier,
  DeliveryAttemptStatus,
} from "@/generated/prisma/enums";

type EnqueueInput = {
  eventId: string;
  requestedById: string;
  tier: DeliveryQueueTier;
  scheduledFor?: Date | null;
  subject: string;
  transcript: string;
};

type QueueTickInput = {
  maxEventsPerTick?: number;
  participantsPerChunk?: number;
};

const DEFAULT_MAX_EVENTS_PER_TICK = 1;
const DEFAULT_PARTICIPANTS_PER_CHUNK = 5;

function now() {
  return new Date();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function promoteRegularToPriority(enqueuedAt: Date) {
  const ageMs = now().getTime() - enqueuedAt.getTime();
  return ageMs >= 18 * 60 * 60 * 1000;
}

async function assertEventOwner(eventId: string, userId: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
    select: { id: true, title: true },
  });
  if (!event) throw new Error("Event not found or unauthorized");
  return event;
}

export async function enqueueEventBatch(input: EnqueueInput) {
  await assertEventOwner(input.eventId, input.requestedById);
  const existingPending = await prisma.deliveryQueueEvent.findFirst({
    where: {
      eventId: input.eventId,
      status: { in: [DeliveryQueueEventStatus.PENDING, DeliveryQueueEventStatus.RUNNING] },
    },
    select: { id: true },
  });

  if (existingPending) {
    return { queueEventId: existingPending.id, alreadyQueued: true };
  }

  const participants = await prisma.participant.findMany({
    where: { eventId: input.eventId, emailed: false },
    select: { id: true },
  });

  const queueEvent = await prisma.deliveryQueueEvent.create({
    data: {
      eventId: input.eventId,
      requestedById: input.requestedById,
      tier: input.tier,
      status: DeliveryQueueEventStatus.PENDING,
      scheduledFor: input.scheduledFor ?? null,
      subject: input.subject,
      transcript: input.transcript,
      items: {
        create: participants.map((participant) => ({
          participantId: participant.id,
          status: DeliveryQueueItemStatus.PENDING,
          lastError: null,
        })),
      },
    },
    select: { id: true },
  });

  return { queueEventId: queueEvent.id, alreadyQueued: false };
}

async function getQueuedEmailPayload(queueEventId: string) {
  const queueEvent = await prisma.deliveryQueueEvent.findUnique({
    where: { id: queueEventId },
    select: { subject: true, transcript: true },
  });
  if (!queueEvent) throw new Error("Queue payload missing");
  return queueEvent;
}

export async function sendSingleParticipant(input: {
  eventId: string;
  participantId: string;
  requestedById: string;
  subject: string;
  transcript: string;
}) {
  const startedAt = Date.now();
  await assertEventOwner(input.eventId, input.requestedById);
  const participant = await prisma.participant.findUnique({
    where: { id: input.participantId },
    select: { id: true, name: true, email: true, eventId: true },
  });
  if (!participant || participant.eventId !== input.eventId) {
    throw new Error("Participant not found for event");
  }

  const job = await prisma.deliveryJob.create({
    data: {
      eventId: input.eventId,
      provider: "RESEND",
      mode: DeliveryMode.SINGLE,
      status: DeliveryJobStatus.RUNNING,
      startedAt: now(),
      batchSize: 1,
    },
  });

  const delays = [0, 15000, 60000];
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const attemptStartedAt = Date.now();
    if (delays[attempt - 1] > 0) await sleep(delays[attempt - 1]);

    try {
      const buildStartedAt = Date.now();
      const built = await buildParticipantCertificate({
        userId: input.requestedById,
        eventId: input.eventId,
        participantId: input.participantId,
      });
      const buildDurationMs = Date.now() - buildStartedAt;

      const certFetchStartedAt = Date.now();
      const certResponse = await fetch(built.certificateUrl);
      if (!certResponse.ok) throw new Error("Certificate fetch failed");
      const certBytes = await certResponse.arrayBuffer();
      const certFetchDurationMs = Date.now() - certFetchStartedAt;
      const certBase64 = Buffer.from(certBytes).toString("base64");

      const html = generateCertificateEmail({
        subject: input.subject,
        eventTitle: built.event.title,
        participantName: built.participant.name,
        transcript: input.transcript,
        certificateUrl: built.certificateUrl,
        verificationCode: built.verificationCode,
      });

      const providerSendStartedAt = Date.now();
      const sendResult = await sendWithProviderFallback({
        to: built.participant.email,
        subject: input.subject,
        html,
        attachments: [
          {
            filename: `${built.participant.name.replace(/\s+/g, "_")}_certificate.png`,
            contentBase64: certBase64,
          },
        ],
      });
      const providerSendDurationMs = Date.now() - providerSendStartedAt;
      console.log("[delivery/single] attempt result", {
        eventId: input.eventId,
        participantId: input.participantId,
        attempt,
        ok: sendResult.ok,
        provider: sendResult.provider,
        buildDurationMs,
        certFetchDurationMs,
        providerSendDurationMs,
        totalAttemptDurationMs: Date.now() - attemptStartedAt,
        error: sendResult.ok ? null : sendResult.errorMessage,
      });

      await prisma.deliveryAttempt.create({
        data: {
          participantId: participant.id,
          jobId: job.id,
          provider: sendResult.provider,
          status: sendResult.ok ? DeliveryAttemptStatus.SENT : DeliveryAttemptStatus.FAILED,
          attemptNo: attempt,
          providerMessageId: sendResult.providerMessageId ?? null,
          errorMessage: sendResult.errorMessage ?? null,
          sentAt: sendResult.ok ? now() : null,
        },
      });

      if (sendResult.ok) {
        await prisma.participant.update({
          where: { id: participant.id },
          data: { emailed: true },
        });
        await prisma.deliveryJob.update({
          where: { id: job.id },
          data: { status: DeliveryJobStatus.COMPLETED, completedAt: now() },
        });
        return { success: true };
      }

      lastError = sendResult.errorMessage || "Send failed";
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Send failed";
      console.error("[delivery/single] attempt exception", {
        eventId: input.eventId,
        participantId: input.participantId,
        attempt,
        durationMs: Date.now() - attemptStartedAt,
        error: lastError,
      });
      await prisma.deliveryAttempt.create({
        data: {
          participantId: participant.id,
          jobId: job.id,
          provider: "RESEND",
          status: DeliveryAttemptStatus.FAILED,
          attemptNo: attempt,
          errorMessage: lastError,
          providerMessageId: mapFailureCode(lastError),
        },
      });
    }
  }

  await prisma.deliveryJob.update({
    where: { id: job.id },
    data: { status: DeliveryJobStatus.FAILED, completedAt: now() },
  });
  console.error("[delivery/single] exhausted retries", {
    eventId: input.eventId,
    participantId: input.participantId,
    durationMs: Date.now() - startedAt,
    lastError,
  });

  return { success: false, error: lastError, failedAttempts: 3 };
}

async function pickNextQueueEvents(limit: number) {
  const eligible = await prisma.deliveryQueueEvent.findMany({
    where: {
      status: DeliveryQueueEventStatus.PENDING,
      OR: [{ scheduledFor: null }, { scheduledFor: { lte: now() } }],
    },
    include: {
      items: {
        where: { status: DeliveryQueueItemStatus.PENDING },
        select: { id: true },
      },
      event: { select: { userId: true } },
    },
    orderBy: [{ enqueuedAt: "asc" }],
    take: 50,
  });

  const scored = eligible.map((q) => {
    const premiumBoost = q.tier === DeliveryQueueTier.PREMIUM ? 100000 : 0;
    const escalated = q.tier === DeliveryQueueTier.REGULAR && promoteRegularToPriority(q.enqueuedAt);
    const escalationBoost = escalated ? 50000 : 0;
    const ageBoost = Math.floor((now().getTime() - q.enqueuedAt.getTime()) / 60000);
    const participantBoost = q.items.length * 3;
    return { ...q, score: premiumBoost + escalationBoost + ageBoost + participantBoost };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

async function processQueueEvent(queueEventId: string, chunkSize: number) {
  const lock = await prisma.deliveryQueueEvent.updateMany({
    where: { id: queueEventId, status: DeliveryQueueEventStatus.PENDING },
    data: {
      status: DeliveryQueueEventStatus.RUNNING,
      startedAt: now(),
      attemptCount: { increment: 1 },
    },
  });
  if (lock.count === 0) return;

  const queueEvent = await prisma.deliveryQueueEvent.findUnique({
    where: { id: queueEventId },
    include: {
      event: { select: { id: true, title: true, userId: true } },
      items: {
        where: { status: DeliveryQueueItemStatus.PENDING },
        include: {
          participant: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
  if (!queueEvent) return;

  const payload = await getQueuedEmailPayload(queueEventId);
  const participantItems = queueEvent.items;

  const failedIds = new Set<string>();

  for (let i = 0; i < participantItems.length; i += chunkSize) {
    const chunk = participantItems.slice(i, i + chunkSize);
    for (const item of chunk) {
      try {
        const built = await buildParticipantCertificate({
          userId: queueEvent.event.userId,
          eventId: queueEvent.event.id,
          participantId: item.participantId,
        });
        const certResponse = await fetch(built.certificateUrl);
        if (!certResponse.ok) throw new Error("Certificate fetch failed");
        const certBase64 = Buffer.from(await certResponse.arrayBuffer()).toString("base64");

        const html = generateCertificateEmail({
          subject: payload.subject,
          eventTitle: queueEvent.event.title,
          participantName: item.participant.name,
          transcript: payload.transcript,
          certificateUrl: built.certificateUrl,
          verificationCode: built.verificationCode,
        });

        const sendResult = await sendWithProviderFallback({
          to: item.participant.email,
          subject: payload.subject,
          html,
          attachments: [
            {
              filename: `${item.participant.name.replace(/\s+/g, "_")}_certificate.png`,
              contentBase64: certBase64,
            },
          ],
        });

        await prisma.deliveryQueueItem.update({
          where: { id: item.id },
          data: {
            status: sendResult.ok ? DeliveryQueueItemStatus.SENT : DeliveryQueueItemStatus.PENDING,
            attemptCount: { increment: 1 },
            lastError: sendResult.ok
              ? null
              : `${sendResult.failureCode || "UNKNOWN"}:${sendResult.errorMessage || "Send failed"}`,
            lastTriedAt: now(),
            sentAt: sendResult.ok ? now() : null,
            provider: sendResult.provider,
            providerMessageId: sendResult.providerMessageId ?? null,
          },
        });

        if (sendResult.ok) {
          await prisma.participant.update({
            where: { id: item.participantId },
            data: { emailed: true },
          });
        } else {
          failedIds.add(item.id);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Send failed";
        await prisma.deliveryQueueItem.update({
          where: { id: item.id },
          data: {
            status: DeliveryQueueItemStatus.PENDING,
            attemptCount: { increment: 1 },
            lastError: `${mapFailureCode(message)}:${message}`,
            lastTriedAt: now(),
          },
        });
        failedIds.add(item.id);
      }
    }

    // immediate retry once for failures in this chunk
    for (const item of chunk.filter((x) => failedIds.has(x.id))) {
      try {
        const refreshed = await prisma.deliveryQueueItem.findUnique({
          where: { id: item.id },
          include: { participant: true },
        });
        if (!refreshed || refreshed.status === DeliveryQueueItemStatus.SENT) continue;

        const built = await buildParticipantCertificate({
          userId: queueEvent.event.userId,
          eventId: queueEvent.event.id,
          participantId: item.participantId,
        });
        const certResponse = await fetch(built.certificateUrl);
        if (!certResponse.ok) throw new Error("Certificate fetch failed");
        const certBase64 = Buffer.from(await certResponse.arrayBuffer()).toString("base64");

        const html = generateCertificateEmail({
          subject: payload.subject,
          eventTitle: queueEvent.event.title,
          participantName: refreshed.participant.name,
          transcript: payload.transcript,
          certificateUrl: built.certificateUrl,
          verificationCode: built.verificationCode,
        });

        const sendResult = await sendWithProviderFallback({
          to: refreshed.participant.email,
          subject: payload.subject,
          html,
          attachments: [
            {
              filename: `${refreshed.participant.name.replace(/\s+/g, "_")}_certificate.png`,
              contentBase64: certBase64,
            },
          ],
        });

        await prisma.deliveryQueueItem.update({
          where: { id: item.id },
          data: {
            status: sendResult.ok ? DeliveryQueueItemStatus.SENT : DeliveryQueueItemStatus.PENDING,
            attemptCount: { increment: 1 },
            lastError: sendResult.ok
              ? null
              : `${sendResult.failureCode || "UNKNOWN"}:${sendResult.errorMessage || "Send failed"}`,
            lastTriedAt: now(),
            sentAt: sendResult.ok ? now() : null,
            provider: sendResult.provider,
            providerMessageId: sendResult.providerMessageId ?? null,
          },
        });
        if (sendResult.ok) {
          await prisma.participant.update({
            where: { id: item.participantId },
            data: { emailed: true },
          });
          failedIds.delete(item.id);
        }
      } catch {
        // keep failed for final sweep
      }
    }
  }

  // final sweep one more try on all unsent
  const stillPending = await prisma.deliveryQueueItem.findMany({
    where: {
      queueEventId,
      status: DeliveryQueueItemStatus.PENDING,
    },
    include: { participant: true },
  });

  for (const item of stillPending) {
    try {
      const built = await buildParticipantCertificate({
        userId: queueEvent.event.userId,
        eventId: queueEvent.event.id,
        participantId: item.participantId,
      });
      const certResponse = await fetch(built.certificateUrl);
      if (!certResponse.ok) throw new Error("Certificate fetch failed");
      const certBase64 = Buffer.from(await certResponse.arrayBuffer()).toString("base64");

      const html = generateCertificateEmail({
        subject: payload.subject,
        eventTitle: queueEvent.event.title,
        participantName: item.participant.name,
        transcript: payload.transcript,
        certificateUrl: built.certificateUrl,
        verificationCode: built.verificationCode,
      });

      const sendResult = await sendWithProviderFallback({
        to: item.participant.email,
        subject: payload.subject,
        html,
        attachments: [
          {
            filename: `${item.participant.name.replace(/\s+/g, "_")}_certificate.png`,
            contentBase64: certBase64,
          },
        ],
      });

      await prisma.deliveryQueueItem.update({
        where: { id: item.id },
        data: {
          status: sendResult.ok ? DeliveryQueueItemStatus.SENT : DeliveryQueueItemStatus.FAILED,
          attemptCount: { increment: 1 },
          lastError: sendResult.ok
            ? null
            : `${sendResult.failureCode || "UNKNOWN"}:${sendResult.errorMessage || "Send failed"}`,
          lastTriedAt: now(),
          sentAt: sendResult.ok ? now() : null,
          provider: sendResult.provider,
          providerMessageId: sendResult.providerMessageId ?? null,
        },
      });
      if (sendResult.ok) {
        await prisma.participant.update({
          where: { id: item.participantId },
          data: { emailed: true },
        });
      }
    } catch (error) {
      await prisma.deliveryQueueItem.update({
        where: { id: item.id },
        data: {
          status: DeliveryQueueItemStatus.FAILED,
          attemptCount: { increment: 1 },
          lastError: `${mapFailureCode(error instanceof Error ? error.message : "Final sweep failed")}:${error instanceof Error ? error.message : "Final sweep failed"}`,
          lastTriedAt: now(),
        },
      });
    }
  }

  const pendingCount = await prisma.deliveryQueueItem.count({
    where: { queueEventId, status: DeliveryQueueItemStatus.PENDING },
  });
  const failedCount = await prisma.deliveryQueueItem.count({
    where: { queueEventId, status: DeliveryQueueItemStatus.FAILED },
  });

  await prisma.deliveryQueueEvent.update({
    where: { id: queueEventId },
    data: {
      status: pendingCount > 0 || failedCount > 0 ? DeliveryQueueEventStatus.FAILED : DeliveryQueueEventStatus.COMPLETED,
      completedAt: now(),
      nextRetryAt: null,
    },
  });
}

export async function processQueueTick(input?: QueueTickInput) {
  const maxEvents = input?.maxEventsPerTick ?? DEFAULT_MAX_EVENTS_PER_TICK;
  const chunkSize = input?.participantsPerChunk ?? DEFAULT_PARTICIPANTS_PER_CHUNK;
  const picked = await pickNextQueueEvents(maxEvents);

  for (const queueEvent of picked) {
    await processQueueEvent(queueEvent.id, chunkSize);
  }

  return { processedEvents: picked.length };
}
