export const getRegistrationSuccessEmail = (event, participantName, teamName = null) => {
  const isTeam = !!teamName;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Eventix</h1>
      </div>
      <h2 style="color: #333; text-align: center;">Registration Successful! 🎉</h2>
      <p style="color: #555; font-size: 16px;">Hi <strong>${participantName}</strong>,</p>
      <p style="color: #555; font-size: 16px;">You have successfully registered for the event: <strong>${event.title}</strong>.</p>
      ${isTeam ? `<p style="color: #555; font-size: 16px;">You are registered as a part of the team: <strong>${teamName}</strong>.</p>` : ''}
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <h3 style="color: #333;">Event Details:</h3>
      <ul style="color: #555; font-size: 15px; line-height: 1.6;">
        <li><strong>Event Name:</strong> ${event.title}</li>
        <li><strong>Date:</strong> ${new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
      </ul>
      <p style="color: #555; font-size: 16px;">We look forward to seeing you there!</p>
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea;">
        <p style="font-size: 12px; color: #999; margin: 0;">&copy; ${new Date().getFullYear()} Eventix. All rights reserved.</p>
        <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    </div>
  `;

  return html;
};
