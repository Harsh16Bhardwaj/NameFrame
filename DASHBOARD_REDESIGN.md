# NameFrame Dashboard Revamp Prompt

## Keep Existing Visual Identity Strictly Consistent

You are redesigning the dashboard for **NameFrame**, an event, participant, certificate, and email management platform.

The goal is to make the dashboard feel more premium, insightful, and useful while staying fully consistent with the existing NameFrame design system.

Do **not** change the visual identity drastically.
Do **not** introduce a completely new color palette.
Do **not** shift the product into a blue/navy enterprise dashboard style.

Keep the existing NameFrame look:

* Dark-mode-first
* `bg-zinc-950` / `bg-black` main background
* `bg-zinc-900`, `bg-zinc-900/50`, `bg-zinc-900/70` for cards and panels
* Teal/cyan accent for primary states
* Rose/pink accent for warnings, destructive states, feedback, or secondary highlights
* White text for headings and important numbers
* Zinc-muted text for labels and descriptions
* Rounded-2xl cards
* Thin subtle borders
* Ambient teal/fuchsia glows only where needed

Use Tailwind-style design language similar to:

```txt
Main background: bg-zinc-950 or bg-black
Sidebar: bg-black or bg-zinc-950 border-r border-white/5
Cards: bg-zinc-900/60 border border-white/5 rounded-2xl
Elevated cards: bg-zinc-900 border border-teal-500/20
Text primary: text-white
Text secondary: text-zinc-400
Text muted: text-zinc-500
Primary accent: text-teal-400, bg-teal-400/10, border-teal-500/30
Primary button: bg-teal-400 text-black hover:bg-teal-300
Warning/secondary accent: text-rose-400, bg-rose-500/10, border-rose-500/30
```

---

# Main Problem With Current Dashboard

The dashboard currently has the right structure but feels visually flat.

Problems to fix:

* KPI cards are too large and not visually distinct enough.
* KPI cards blend with the page background.
* Recent Events section is too tall and wastes vertical space.
* Analytics cards and chart areas look too plain.
* Activity Log background blends with surrounding sections.
* Graphs lack visual hierarchy.
* The UI feels like a basic admin panel instead of a polished SaaS analytics dashboard.
* The dashboard has metrics, but not enough genuine insights.

The redesign should make the dashboard feel like an **event intelligence command center**.

---

# Layout Restructure

Redesign the dashboard using this structure:

```txt
Header
------------------------------------------------
Dashboard title       Search        Date Filter       Export Button

Compact KPI Grid
------------------------------------------------
Events | Unique Participants | Repeat Participants | Certificates | Emails | Success Rate

Main Analytics Section
------------------------------------------------
Large Toggleable Chart Card          Smart Insights Panel

Recent Events + Health Summary
------------------------------------------------
Compact Recent Events Table          Email/Certificate Health Card

Mini Insights Row
------------------------------------------------
Top Event | Frequent Participant | Retention | Avg Processing Time

Quick Actions
------------------------------------------------
Create Event | Upload Participants | Generate Certificates | Send Emails | Templates | Export

Activity Log
------------------------------------------------
Timeline-style recent activity feed
```

---

# 1. Header Improvements

Keep the current dashboard heading but polish the top bar.

Add:

* Search input for events
* Date range filter
* Optional event status filter
* Export Report button

Design:

```txt
Header background should not be a heavy card.
Keep it clean and integrated into the page.
Search input should use:
bg-zinc-900/70
border border-white/10
text-zinc-300
placeholder:text-zinc-500
focus:border-teal-500/40
```

The export button should use the primary NameFrame CTA style:

```txt
bg-teal-400 text-black hover:bg-teal-300 rounded-lg
```

---

# 2. Sidebar Improvements

Keep the existing sidebar structure, but improve polish.

The active item should use:

```txt
bg-teal-400/10
text-teal-400
border border-teal-500/30
shadow-[0_0_20px_rgba(45,212,191,0.08)]
```

Inactive items:

```txt
text-zinc-400 hover:text-white hover:bg-white/5
```

Sidebar background:

```txt
bg-black or bg-zinc-950
border-r border-white/5
```

Do not make the sidebar bright.
Do not use a completely different accent color.

---

# 3. Shrink KPI Cards

The current KPI cards take too much space.

Make them smaller, more compact, and more useful.

Each KPI card should include:

* Icon
* Label
* Main value
* Small trend indicator
* One-line micro insight
* Optional mini sparkline

Use 6 compact cards:

1. **Total Events**

   * Shows total events.
   * Micro insight: "+3 this month" or "No new events this month."

2. **Unique Participants**

   * Count unique participants using email as identifier.
   * Micro insight: "10 unique emails detected."

3. **Repeat Participants**

   * Count people who attended more than one event.
   * Micro insight: "23% returning audience."

4. **Certificates Generated**

   * Total certificates generated.
   * Micro insight: "80% completion rate."

5. **Emails Sent**

   * Total emails sent.
   * Micro insight: "Last batch sent 2h ago."

6. **Email Success Rate**

   * Successful emails divided by total attempted emails.
   * Micro insight: "3 failed deliveries need review."

KPI card styling:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
p-4
hover:border-teal-500/30
hover:bg-zinc-900
transition-all
```

For important positive values:

```txt
text-teal-400
bg-teal-400/10
```

For warnings:

```txt
text-rose-400
bg-rose-500/10
```

Do not use heavy shadows. Use subtle glow only on hover or active states.

---

# 4. Add Real Dashboard Insights

The dashboard should not only show raw KPIs. It should analyze event performance, participant behavior, email health, and certificate progress.

Available data includes:

* Events
* Event names
* Event descriptions
* Event dates
* Event creation date
* Number of participants
* Participant names
* Participant emails
* Certificate generation data
* Email sending data
* Email success/failure/pending status
* Activity logs

Use this data to generate genuine insights.

---

# 5. Participant Insights

Create analytics for:

* Unique participants across all events
* Repeat participants
* Most frequent participants
* Participant overlap between events
* New vs returning participants
* Participant growth over time
* Drop or peak in participants between events
* Events with highest participant retention

Example insights:

```txt
23% of participants attended more than one event.
Aarav Sharma appeared in 4 events, the highest among all participants.
Event A and Event B had 42% participant overlap.
Participant count dropped by 18% compared to the previous event.
```

Use participant email as the primary unique identifier.

---

# 6. Event Insights

Create analytics for:

* Highest participation event
* Lowest participation event
* Average participants per event
* Participant spikes
* Participant drops
* Monthly event frequency
* Scheduled vs completed events
* Upcoming events
* Events with pending emails
* Events with pending certificate generation

Example insights:

```txt
Your highest engagement came from Lorem Lorem.
Participation peaked in March.
2 events still have pending email delivery.
Average event size increased by 12% over the last 3 events.
```

---

# 7. Email and Certificate Insights

Create analytics for:

* Total emails sent
* Email success rate
* Failed emails
* Pending emails
* Emails sent per event
* Email delivery trend over time
* Certificate completion rate
* Certificates generated vs pending
* Time from event creation to certificate generation
* Time from certificate generation to email sending
* Time from event creation to final email sending
* Events where certificates were generated but emails were not sent
* Events where email delivery failed

Example insights:

```txt
Emails were sent successfully to 94% of participants.
Average time from event creation to email sending is 2.4 days.
Event X had the highest email failure rate.
10 certificates were generated but 0 emails were sent.
```

---

# 8. Main Analytics Panel

Add a large chart card after the KPI section.

This should be the primary analytics component.

It should have tabs or a dropdown to switch between:

* Participation
* Certificates
* Emails
* Retention
* Event Health

Inside the chart card, allow chart type switching where useful:

* Line chart
* Bar chart
* Area chart
* Donut chart

Suggested charts:

1. **Participants Over Time**

   * Line or area chart

2. **Participants Per Event**

   * Bar chart

3. **Email Delivery Status**

   * Donut chart

4. **Certificate Completion**

   * Donut or radial chart

5. **New vs Returning Participants**

   * Stacked bar or donut chart

6. **Participant Overlap**

   * Matrix or heatmap-style card

Chart card styling:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
p-5
```

Chart plot area:

```txt
bg-black/20
border border-white/5
rounded-xl
p-4
```

Chart colors should follow NameFrame identity:

```txt
Primary chart line: teal-400
Secondary chart area: teal-400/10
Warning/failure values: rose-500
Neutral values: zinc-500 / zinc-600
Success values: emerald-400
Pending values: amber-400
```

Do not introduce random chart colors.

---

# 9. Smart Insights Panel

Beside the main chart, add a **Smart Insights** or **Event Intelligence** panel.

This panel should show plain-English insights.

Each insight card should include:

* Icon
* Category
* Insight text
* Severity tag

Severity types:

```txt
Positive: teal/emerald styling
Neutral: zinc styling
Warning: amber styling
Critical: rose styling
```

Example cards:

```txt
Participation dropped by 18% compared to the previous event.
12 participants attended more than 2 events.
Certificates are generated, but emails are pending for 1 event.
Email success rate is below 80% for Event X.
Most returning participants came from Event Y.
```

Design:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
p-5
```

Individual insight items:

```txt
bg-black/20
border border-white/5
rounded-xl
p-3
```

Use teal border/glow only for the most important positive insight.
Use rose only for warnings or failure states.

---

# 10. Shrink Recent Events Section

The Recent Events section should no longer dominate the dashboard.

Make it compact.

Requirements:

* Reduce height.
* Show only 4 to 5 rows.
* Add internal scroll if needed.
* Reduce row padding.
* Keep "View All".
* Make table visually cleaner.
* Add status badges.
* Add email/certificate counts per event.

Columns:

```txt
Event Name
Date
Participants
Certificates
Emails
Status
```

Status badge examples:

```txt
Scheduled: bg-blue-500/10 text-blue-400 border-blue-500/20
Completed: bg-teal-400/10 text-teal-400 border-teal-500/20
Draft: bg-zinc-500/10 text-zinc-400 border-zinc-500/20
Failed/Error: bg-rose-500/10 text-rose-400 border-rose-500/20
```

Table container:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
```

Table header:

```txt
text-zinc-400
bg-black/20
```

Rows:

```txt
border-t border-white/5
hover:bg-white/[0.03]
```

---

# 11. Add Health Summary Beside Recent Events

Next to Recent Events, add a compact health card.

This can show:

* Email health donut
* Certificate pipeline
* Pending actions
* Event status distribution

Example:

```txt
Email Health
Sent: 92%
Failed: 5%
Pending: 3%
```

Use a donut chart or compact progress bars.

Styling should stay inside NameFrame system:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
p-5
```

---

# 12. Add Mini Insights Row

Between Recent Events and Quick Actions, add a row of compact analytics widgets.

Suggested widgets:

1. **Top Event**

   * Highest participant event

2. **Most Frequent Participant**

   * Person/email appearing across most events

3. **Retention**

   * New vs returning participant ratio

4. **Avg Processing Time**

   * Average time from event creation to email sending

5. **Certificate Pipeline**

   * Generated vs pending

Each widget should be compact and visually strong.

Card style:

```txt
bg-zinc-900/50
border border-white/5
rounded-2xl
p-4
hover:border-teal-500/20
transition-all
```

Use small progress bars, mini donuts, or icons.

---

# 13. Improve Quick Actions

Quick Actions should look more useful and polished.

Actions:

* Create Event
* Upload Participants
* Generate Certificates
* Send Emails
* Manage Templates
* Export Report

Each quick action should include:

* Icon
* Title
* Short description
* CTA-like hover behavior

Card style:

```txt
bg-zinc-900/60
border border-white/5
rounded-2xl
p-4
hover:bg-zinc-900
hover:border-teal-500/30
transition-all
```

Primary action can have a stronger accent:

```txt
bg-teal-400/10
border-teal-500/30
text-teal-400
```

Do not make all quick actions teal. Only highlight the most important next action.

---

# 14. Improve Activity Log

The Activity Log should become a compact timeline feed.

Current issue: it blends into the background.

Fix with:

* Distinct card surface
* Timeline-style vertical line
* Status dots
* Action icons
* Better timestamps
* Event name
* Activity description

Activity types:

* Event created
* Participants uploaded
* Certificates generated
* Emails sent
* Email failed
* Template assigned
* Event completed

Styling:

```txt
Container:
bg-zinc-900/60
border border-white/5
rounded-2xl
p-5

Timeline item:
relative
pl-6
border-l border-white/10

Status dot:
absolute left-[-5px]
size-2.5 rounded-full
```

Color logic:

```txt
Success: bg-teal-400 or bg-emerald-400
Info: bg-cyan-400
Warning: bg-amber-400
Error: bg-rose-500
Neutral: bg-zinc-500
```

Log item background:

```txt
bg-black/20
border border-white/5
rounded-xl
p-3
```

---

# 15. Chart Requirements

Use meaningful charts only.

Required charts:

## Line / Area Chart

For:

* Participants over time
* Emails sent over time
* Certificate generation over time

## Bar Chart

For:

* Participants per event
* Emails sent per event
* Certificates generated per event

## Donut / Pie Chart

For:

* Email status distribution
* Certificate completion
* Event status distribution
* New vs returning participants

## Heatmap / Matrix

For:

* Participant overlap between events using participant emails

## Mini Sparklines

For:

* KPI cards
* Event trends
* Email activity trend

Every chart must include:

* Tooltip
* Empty state
* Loading state
* Responsive behavior
* Accessible labels
* Clean axis styling
* Muted grid lines using `border-white/5` or zinc tones

---

# 16. Data Utility Functions Needed

Create dashboard calculation utilities for:

```txt
getTotalEvents()
getUniqueParticipantsByEmail()
getRepeatParticipants()
getMostFrequentParticipants()
getParticipantsPerEvent()
getAverageParticipantsPerEvent()
getHighestParticipationEvent()
getLowestParticipationEvent()
getParticipantGrowthTrend()
getParticipantDropBetweenEvents()
getEmailSuccessRate()
getFailedEmailsCount()
getPendingEmailsCount()
getCertificatesGeneratedCount()
getPendingCertificatesCount()
getCertificateCompletionRate()
getAverageTimeFromEventCreationToCertificateGeneration()
getAverageTimeFromCertificateGenerationToEmailSent()
getAverageTimeFromEventCreationToEmailSent()
getEventStatusDistribution()
getNewVsReturningParticipants()
getParticipantOverlapBetweenEvents()
```

Important:

Use participant email as the primary identifier for unique participants and overlap detection.

---

# 17. Empty States

The dashboard should look good even with little data.

Do not show misleading fake insights.

Use meaningful empty states:

```txt
No email data yet.
Generate certificates to see completion analytics.
Create more events to unlock participant trends.
Upload participants to see overlap analysis.
No repeated participants found yet.
```

Empty chart design:

```txt
bg-black/20
border border-dashed border-white/10
rounded-xl
text-zinc-500
```

Include a small CTA where helpful:

```txt
Upload Participants
Create Event
Generate Certificates
```

---

# 18. Interaction Requirements

Add interactivity:

* Toggle chart category: Participants / Emails / Certificates / Retention / Event Health
* Toggle chart type where useful: Line / Bar / Area / Donut
* Date range filter
* Event status filter
* Click KPI card to filter dashboard context
* Click event row to open event details
* Hover chart points to show tooltip
* Smart Insights should update based on filters
* Recent Events should support "View All"

---

# 19. Final Design Direction

The final dashboard should feel like:

```txt
A dark, premium, data-rich NameFrame command center.
```

It should be:

* Clean
* Futuristic
* Consistent with current NameFrame colors
* Dark-mode native
* Insightful
* Polished
* Useful
* Not overly neon
* Not visually cluttered
* Not drastically different from the existing site

Do not redesign the whole product identity.
Improve the dashboard while respecting the existing visual guide.

Final expected outcome:

* Smaller and better KPI cards
* More contrast between background, cards, and nested chart areas
* Better analytics and actual insights
* Toggleable chart system
* Compact Recent Events section
* New mini insight row between Recent Events and Quick Actions
* Better Quick Actions
* Better Activity Log
* Strong empty states
* Responsive layout
* Reusable dashboard components
* Utility functions for real event, participant, certificate, and email analytics

---

## Final Critical Instruction

**Follow the existing NameFrame visual guide strictly.**

Use:
* `zinc-950` / `black` dark surfaces
* Teal primary accents
* Rose warning accents
* Rounded-2xl cards
* Subtle `border-white/5` borders
* Muted zinc text
* Ambient glows only where intentional

**Do not introduce a new unrelated color palette.**

**The dashboard should look like a natural extension of the existing NameFrame landing page and app, not a different product.**
