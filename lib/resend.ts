import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'JoJoScentSation <onboarding@resend.dev>', // Use a verified domain in production
    to: email,
    subject: 'Verify your email address - JoJoScentSation',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to JoJoScentSation!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #C9A85C; color: #0A0A0A; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        <p style="margin-top: 24px; font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'JoJoScentSation <onboarding@resend.dev>', // Use a verified domain in production
    to: email,
    subject: 'Reset your password - JoJoScentSation',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #C9A85C; color: #0A0A0A; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 24px; font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email. The link expires in 1 hour.</p>
      </div>
    `
  });
}
