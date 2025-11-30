'use server';

import transporter from '@/lib/nodemailer';

export async function sendEmailAction({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
    callToActionText: string;
    greeting?: string;
  };
}) {
  console.log('[SendEmailAction] Action called with:', { to, subject });
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `BestSlot - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              /* Client-specific resets */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

              /* General styles for modern look */
              .body-wrapper {
                  font-family: 'Arial', sans-serif;
                  background-color: #f8f9fa; /* Light background for the whole email */
                  margin: 0;
                  padding: 0;
              }
              .main-card {
                  background-color: #ffffff; /* White card background */
                  border-radius: 8px; /* Soft corners */
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* Subtle shadow */
                  border: 1px solid #e9ecef; /* Light border */
                  padding: 30px;
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #dee2e6;
              }
              .footer {
                  text-align: center;
                  padding-top: 20px;
                  font-size: 12px;
                  color: #adb5bd;
              }
              .cta-button {
                  display: inline-block;
                  padding: 12px 25px;
                  margin-top: 20px;
                  background-color: #007bff; /* Primary Blue */
                  color: #ffffff !important; /* Force white text */
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  font-size: 16px;
              }
          </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
          <center class="body-wrapper" style="width: 100%; table-layout: fixed; padding-top: 40px; padding-bottom: 40px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                      <td align="center" style="padding: 0 0 20px 0;">
                          <h2 style="margin:0; color:#343a40;">BestSlot</h2> 
                          </td>
                  </tr>

                  <tr>
                      <td align="center" class="main-card" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e9ecef; padding: 30px;">
                          
                          <h1 style="font-size: 24px; color: #343a40; margin-top: 0; margin-bottom: 20px; font-weight: 600;">
                              ${subject}
                          </h1>

                          ${meta.greeting ? `<p style="font-size: 16px; color: #495057; margin-bottom: 15px;">Hi ${meta.greeting},</p>` : ''}

                          <p style="font-size: 16px; color: #495057; line-height: 1.5; margin-bottom: 25px;">
                              ${meta.description}
                          </p>

                          <div style="text-align: center;">
                              <a href="${meta.link}" class="cta-button" style="display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                  ${meta.callToActionText || 'Complete Action'}
                              </a>
                          </div>

                      </td>
                  </tr>

                  <tr>
                      <td align="center" class="footer" style="padding-top: 30px;">
                          <p style="margin: 0; color: #adb5bd;">
                              © ${new Date().getFullYear()} BestSlot. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0 0; color: #adb5bd;">
                              This is an automated message, please do not reply.
                          </p>
                      </td>
                  </tr>

              </table>
          </center>
      </body>
      </html>
    `,
  };

  try {
    console.log('[SendEmailAction] Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('[SendEmailAction]: Email sent successfully');
    return { success: true };
    // biome-ignore lint/suspicious/noExplicitAny: error
  } catch (err: any) {
    console.error('[SendEmailAction]:', err);
    return { success: false, error: err.message };
  }
}
