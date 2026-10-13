import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMeetingNotification({
    studentEmails,
    meetingDetails,
    isUpdate,
}: {
    studentEmails: string[];
    meetingDetails: {
        datetime: Date;
        purpose: string;
        location: string | null;
        groupName: string;
        facultyName: string;
    };
    isUpdate?: boolean;
}) {
    const formattedDate = meetingDetails.datetime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Meeting Notification</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e4e8;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a2744;padding:28px 36px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:14px;">
                    <img src="https://yourdomainname.com/Logo.png" width="40" height="40" style="border-radius:10px;display:block;" alt="Logo" />
                  </td>
                  <td>
                    <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">Projexia</div>
                    <div style="color:#a0b4d8;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;">Project Management System</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="background:#4F8EF7;padding:10px 36px;">
              <span style="color:#ffffff;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Meeting Notification</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">
              <p style="font-size:15px;color:#4a5568;margin:0 0 24px;line-height:1.7;">
                Hello, ${isUpdate ? 'an existing meeting has been <strong>updated</strong>' : 'a new meeting has been scheduled'} for your group
                <strong style="color:#1a2744;">${meetingDetails.groupName}</strong> by
                <strong style="color:#1a2744;">${meetingDetails.facultyName}</strong>.
                Please review the details below and mark your calendar.
              </p>

              <!-- Meeting Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafd;border-radius:10px;border:1px solid #dce5f2;overflow:hidden;margin-bottom:28px;">
                <tr>
                  <td colspan="2" style="background:#eef3fc;padding:12px 20px;border-bottom:1px solid #dce5f2;">
                    <span style="font-size:11px;font-weight:700;color:#2d4a8a;letter-spacing:1px;text-transform:uppercase;">Meeting Details</span>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #eef1f6;">
                  <td style="padding:14px 20px;width:36%;color:#7b8ea8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">📅 Date &amp; Time</td>
                  <td style="padding:14px 20px;color:#1a2744;font-size:14px;font-weight:600;">${formattedDate}</td>
                </tr>
                <tr style="border-bottom:1px solid #eef1f6;">
                  <td style="padding:14px 20px;color:#7b8ea8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">💬 Purpose</td>
                  <td style="padding:14px 20px;color:#2d4878;font-size:14px;">${meetingDetails.purpose}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;color:#7b8ea8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">📍 Location</td>
                  <td style="padding:14px 20px;color:#2d4878;font-size:14px;">${meetingDetails.location || 'To Be Announced'}</td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="#" style="display:inline-block;background:#4F8EF7;color:#ffffff;text-decoration:none;padding:13px 36px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">View Meeting Details</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#9aabbf;line-height:1.7;margin:0;border-top:1px solid #edf1f7;padding-top:20px;">
                If you have questions or cannot attend, please contact your faculty coordinator directly.
                This is an automated notification — please do not reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5fb;padding:18px 36px;border-top:1px solid #dce5f2;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:#9aabbf;">© ${new Date().getFullYear()} Projexia</td>
                  <td align="right">
                    <a href="#" style="font-size:12px;color:#7b8ea8;text-decoration:none;margin-left:16px;">Unsubscribe</a>
                    <a href="#" style="font-size:12px;color:#7b8ea8;text-decoration:none;margin-left:16px;">Privacy Policy</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            // Resend testing keys only allow sending to the verified developer email.
            // When going to production with a real domain, revert this back to `to: studentEmails`.
            to: 'harshilsolanki26102005@gmail.com',
            subject: `📅 ${isUpdate ? 'Meeting Updated' : 'New Meeting Scheduled'}: ${meetingDetails.groupName}`,
            html,
        });
    } catch (e) {
        console.error("Failed to send meeting notification email:", e);
    }
}