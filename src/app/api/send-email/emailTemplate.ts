export function generateCertificateEmail({
  subject,
  eventTitle,
  participantName,
  transcript,
  certificateUrl,
}: {
  subject: string;
  eventTitle: string;
  participantName: string;
  transcript: string;
  certificateUrl: string;
}) {
  const preheader = `Congratulations ${participantName}! Your certificate for "${eventTitle}" is here.`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      /* Client‑safe resets */
      body, table, td { margin: 0; padding: 0; mso-table-lspace:0; mso-table-rspace:0; }
      img { border:0; line-height:100%; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
      a { text-decoration: none; }

      /* Container */
      .wrapper { width:100%; table-layout:fixed; background-color:#f5f5f5; padding:20px 0; }
      .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 4px; overflow: hidden; }

      /* Header */
      .header { background-color: #004080; color: #ffffff; text-align: center; padding: 20px; font-family: Arial, sans-serif; font-size: 24px; }
      .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }

      /* Content */
      .content { padding: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; }
      .content h2 { font-size: 20px; margin-bottom: 10px; color: #004080; }

      /* Certificate image */
      .certificate-container { text-align: center; margin: 30px 0; }
      .certificate-image { width: 100%; max-width: 500px; border: 1px solid #dddddd; border-radius: 4px; }

      /* Button */
      .button { display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;
                color: #ffffff !important; background-color: #28a745; border-radius: 4px; }
      .button-container { text-align: center; margin: 20px 0; }

      /* Footer */
      .footer { font-family: Arial, sans-serif; font-size: 12px; color: #777777; text-align: center; padding: 20px; }
    </style>
  </head>
  <body>
    <!-- Preheader Text : hidden but shown in preview -->
    <div class="preheader">${preheader}</div>

    <div class="wrapper">
      <table class="main" align="center" cellpadding="0" cellspacing="0" role="presentation">
        <!-- Header -->
        <tr>
          <td class="header">
            ${eventTitle || "Certificate of Completion"}
          </td>
        </tr>

        <!-- Body Content -->
        <tr>
          <td class="content">
            <p>Dear ${participantName},</p>
            <p>${transcript}</p>

            <div class="certificate-container">
              <img
                src="${certificateUrl}"
                alt="Certificate of Completion for ${participantName}"
                class="certificate-image"
              >
            </div>

            <div class="button-container">
              <a href="${certificateUrl}" class="button" target="_blank" download>
                Download Your Certificate
              </a>
            </div>

            <p>Congratulations again on your achievement! We appreciate your participation.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="footer">
            <p>This is an automated message sent on behalf of ${eventTitle || "Event Organizer"}.</p>
            <p>If you have any questions, reply to this email or contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}
