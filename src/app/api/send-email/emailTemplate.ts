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
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .content {
          padding: 20px 0;
        }
        .certificate-container {
          text-align: center;
          margin: 30px 0;
        }
        .certificate-image {
          max-width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${eventTitle || 'Certificate of Completion'}</h1>
      </div>
      <div class="content">
        <p>Dear ${participantName},</p>
        <p>${transcript}</p>
        <div class="certificate-container">
          <img src="${certificateUrl}" alt="Your Certificate" class="certificate-image">
          <div>
            <a href="${certificateUrl}" class="button" download target="_blank">Download Certificate</a>
          </div>
        </div>
        <p>Congratulations again, and thank you for your participation!</p>
      </div>
      <div class="footer">
        <p>This is an automated email sent on behalf of ${eventTitle || 'Event Organizer'}.</p>
      </div>
    </body>
    </html>
  `;
}