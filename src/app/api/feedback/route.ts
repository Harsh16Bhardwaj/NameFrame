import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define the expected request body interface
interface FeedbackRequestBody {
  name: string;
  email: string;
  rating: number;
  bugs?: string;
  navigation: number;
  message: string;
}

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body: FeedbackRequestBody = await request.json();
    const { name, email, rating, bugs, navigation, message } = body;

    // Validate required fields
    if (!name || !email || !rating || !navigation || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bhardwajharshmait23@gmail.com', // Replace with your recipient email
      subject: `New Website Feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4b3a70; text-align: center;">New Website Feedback</h2>
          <hr style="border: 1px solid #4b3a70; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Overall Rating:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
          <p><strong>Navigation Ease:</strong> ${'★'.repeat(navigation)}${'☆'.repeat(5 - navigation)}</p>
          ${bugs ? `<p><strong>Bugs Found:</strong></p><p style="background: #f8f8f8; padding: 10px; border-radius: 4px;">${bugs}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background: #f8f8f8; padding: 10px; border-radius: 4px;">${message}</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for your input.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback. Please try again later.' },
      { status: 500 }
    );
  }
}