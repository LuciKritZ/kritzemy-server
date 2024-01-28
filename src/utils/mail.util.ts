import { createTransport, type Transporter } from 'nodemailer';
import { renderFile } from 'ejs';
import { join as joinPath } from 'path';
import { getEnvVariable } from '@/config';

interface EmailOptions {
  email: string;
  subject: string;
  templateName: string;
  data: {
    [key: string]: any;
  };
}

const sendEmail = async ({
  email,
  subject,
  templateName,
  data,
}: EmailOptions) => {
  // SMTP Credentials
  const host = getEnvVariable('SMTP_HOST');
  const port = Number(getEnvVariable('SMTP_PORT'));
  const service = getEnvVariable('SMTP_SERVICE');
  const user = getEnvVariable('SMTP_EMAIL');
  const pass = getEnvVariable('SMTP_PASSWORD');

  const transporter: Transporter = createTransport({
    host,
    port,
    service,
    auth: {
      user,
      pass,
    },
  });

  // Adding template path
  const templatePath = joinPath(__dirname, '../templates', templateName);

  // Rendering the email template with ejs
  const html: string = await renderFile(templatePath, data);

  const mailOptions = {
    from: user,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
