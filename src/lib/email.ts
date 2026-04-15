import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = getTransporter();
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"PoliArena" <mapachemediano@gmail.com>',
    to: email,
    subject: 'Verifica tu cuenta en PoliArena',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1A0A10; color: #F5F0F2; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #D4A84B; font-size: 28px; margin: 0;">🎮 PoliArena</h1>
          <p style="color: #C4B0B8; margin-top: 8px;">Sistema de torneos de esports del IPN</p>
        </div>
        <h2 style="color: #F5F0F2;">Verifica tu cuenta</h2>
        <p style="color: #C4B0B8; line-height: 1.6;">
          Gracias por registrarte en PoliArena. Para activar tu cuenta, haz clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #7B1E3B, #D4A84B); color: #F5F0F2; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Verificar mi cuenta
          </a>
        </div>
        <p style="color: #C4B0B8; font-size: 14px;">Este enlace expira en <strong style="color: #D4A84B;">24 horas</strong>.</p>
        <hr style="border-color: rgba(123, 30, 59, 0.3); margin: 32px 0;">
        <p style="color: #C4B0B850; font-size: 12px; text-align: center;">PoliArena — ESCOM, Instituto Politécnico Nacional</p>
      </div>
    `,
  });

  console.log('📧 Email de verificación enviado a:', email);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = getTransporter();
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"PoliArena" <mapachemediano@gmail.com>',
    to: email,
    subject: 'Recupera tu contraseña de PoliArena',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1A0A10; color: #F5F0F2; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #D4A84B; font-size: 28px; margin: 0;">🎮 PoliArena</h1>
          <p style="color: #C4B0B8; margin-top: 8px;">Sistema de torneos de esports del IPN</p>
        </div>
        <h2 style="color: #F5F0F2;">Recuperar contraseña</h2>
        <p style="color: #C4B0B8; line-height: 1.6;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #7B1E3B, #D4A84B); color: #F5F0F2; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #C4B0B8; font-size: 14px;">Este enlace expira en <strong style="color: #D4A84B;">1 hora</strong>.</p>
        <hr style="border-color: rgba(123, 30, 59, 0.3); margin: 32px 0;">
        <p style="color: #C4B0B850; font-size: 12px; text-align: center;">PoliArena — ESCOM, Instituto Politécnico Nacional</p>
      </div>
    `,
  });

  console.log('📧 Email de recuperación enviado a:', email);
}