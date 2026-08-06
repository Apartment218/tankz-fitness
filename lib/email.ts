import nodemailer from "nodemailer";

function getRequiredEnvironmentVariable(
  name: string,
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} environment variable is not configured.`,
    );
  }

  return value;
}

function getSmtpPort() {
  const rawPort =
    process.env.SMTP_PORT?.trim() || "465";

  const port = Number(rawPort);

  if (
    !Number.isInteger(port) ||
    port <= 0
  ) {
    throw new Error(
      "SMTP_PORT must be a valid port number.",
    );
  }

  return port;
}

function getSmtpSecure() {
  return (
    process.env.SMTP_SECURE?.trim().toLowerCase() !==
    "false"
  );
}

export function getEmailTransporter() {
  const host =
    process.env.SMTP_HOST?.trim() ||
    "ox.livemail.co.uk";

  const user =
    getRequiredEnvironmentVariable(
      "SMTP_USER",
    );

  const password =
    getRequiredEnvironmentVariable(
      "SMTP_PASSWORD",
    );

  return nodemailer.createTransport({
    host,
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: {
      user,
      pass: password,
    },
  });
}

export function getEmailFromAddress() {
  const configuredFrom =
    process.env.SMTP_FROM?.trim();

  if (configuredFrom) {
    return configuredFrom;
  }

  const user =
    getRequiredEnvironmentVariable(
      "SMTP_USER",
    );

  return `Tankz Fitness <${user}>`;
}

export function getLeadNotificationEmail() {
  return (
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    getRequiredEnvironmentVariable(
      "SMTP_USER",
    )
  );
}