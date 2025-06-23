export function generateCertificateEmail({
  subject,
  eventTitle,
  participantName,
  transcript,
  certificateUrl,
  verificationCode,
}: {
  subject: string;
  eventTitle: string;
  participantName: string;
  transcript: string;
  certificateUrl: string;
  verificationCode?: string;
}) {
  const preheader = `Congratulations ${participantName}! Your certificate for "${eventTitle}" is here.`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>      /* Client‑safe resets */
      body, table, td { margin: 0; padding: 0; mso-table-lspace:0; mso-table-rspace:0; }
      img { border:0; line-height:100%; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; outline:none; }
      a { text-decoration: none; }
      table { border-collapse: collapse; }
      
      /* Container */
      .wrapper { width:100%; table-layout:fixed; background-color:#f5f5f5; padding:20px 0; }
      .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 4px; overflow: hidden; }

      /* Header */
      .header { background-color: #004080; color: #ffffff; text-align: center; padding: 20px; font-family: Arial, sans-serif; font-size: 24px; }
      .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }

      /* Content */
      .content { padding: 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; }
      .content h2 { font-size: 20px; margin-bottom: 10px; color: #004080; }      /* Certificate image */
      .certificate-container { text-align: center; margin: 30px 0; padding: 0; }
      .certificate-image { 
        width: 100% !important; 
        max-width: 100% !important; 
        height: auto !important; 
        border: 1px solid #dddddd; 
        border-radius: 4px; 
        display: block !important; 
        margin: 0 auto !important;
        object-fit: contain;
      }

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
            <p>${transcript}</p>            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <img
                    src="${certificateUrl}"
                    alt="Certificate of Completion for ${participantName}"
                    width="100%"
                    style="width: 100% !important; max-width: 100% !important; height: auto !important; display: block !important; border: 1px solid #dddddd; border-radius: 4px; object-fit: contain;"
                  />
                </td>
              </tr>
            </table>            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <a href="${certificateUrl}" 
                     style="display: inline-block; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff !important; background-color: #28a745; border-radius: 4px; text-decoration: none;" 
                     target="_blank" 
                     download>
                    Download Your Certificate
                  </a>
                </td>
              </tr>
            </table>

            ${verificationCode ? `
            <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h3 style="color: #004080; margin-bottom: 10px;">Certificate Verification</h3>
              <p style="margin-bottom: 15px;">Your certificate is authentic and can be verified using the code below:</p>
              <div style="background-color: #ffffff; border: 2px solid #004080; border-radius: 4px; padding: 12px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #004080; letter-spacing: 2px;">
                ${verificationCode}
              </div>
              <p style="margin-top: 15px; font-size: 14px; color: #666;">
                Anyone can verify this certificate at: 
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nameframe.site'}/verify" style="color: #004080;">
                  ${process.env.NEXT_PUBLIC_APP_URL || 'https://nameframe.site'}/verify
                </a>
              </p>
            </div>
            ` : ''}

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
