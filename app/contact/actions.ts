"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getEmailFromAddress,
  getEmailTransporter,
  getLeadNotificationEmail,
} from "@/lib/email";
import { LeadStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function readText(
  formData: FormData,
  name: string,
) {
  return String(
    formData.get(name) ?? "",
  ).trim();
}

function readOptionalText(
  formData: FormData,
  name: string,
) {
  return readText(formData, name) || null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );
}

export async function submitContactForm(
  formData: FormData,
) {
  const firstName = readText(
    formData,
    "firstName",
  );

  const lastName = readOptionalText(
    formData,
    "lastName",
  );

  const email = readText(
    formData,
    "email",
  ).toLowerCase();

  const phone = readOptionalText(
    formData,
    "phone",
  );

  const goal = readOptionalText(
    formData,
    "goal",
  );

  const subject =
    readOptionalText(
      formData,
      "subject",
    ) || "General enquiry";

  const message = readText(
    formData,
    "message",
  );

  if (
    !firstName ||
    !email ||
    !message
  ) {
    throw new Error(
      "First name, email address and message are required.",
    );
  }

  if (!isValidEmail(email)) {
    throw new Error(
      "Please enter a valid email address.",
    );
  }

  const lead = await prisma.lead.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      goal,
      subject,
      message,
      status: LeadStatus.NEW,
      converted: false,
    },
  });

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const transporter =
      getEmailTransporter();

    const fromAddress =
      getEmailFromAddress();

    const notificationEmail =
      getLeadNotificationEmail();

    const safeFullName =
      escapeHtml(fullName);

    const safeFirstName =
      escapeHtml(firstName);

    const safeEmail =
      escapeHtml(email);

    const safePhone =
      escapeHtml(
        phone || "Not provided",
      );

    const safeGoal =
      escapeHtml(
        goal || "Not provided",
      );

    const safeSubject =
      escapeHtml(subject);

    const safeMessage =
      escapeHtml(message);

    const safeLeadId =
      escapeHtml(lead.id);

    const notificationEmailRequest =
      transporter.sendMail({
        from: fromAddress,
        to: notificationEmail,
        replyTo: {
          name: fullName,
          address: email,
        },
        subject: `New Tankz Fitness lead — ${fullName}`,
        text: [
          "A new website enquiry has been submitted.",
          "",
          `Name: ${fullName}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          `Goal: ${goal || "Not provided"}`,
          `Enquiry type: ${subject}`,
          "",
          "Message:",
          message,
          "",
          `Lead ID: ${lead.id}`,
          "",
          "Reply directly to this email to contact the lead.",
        ].join("\n"),
        html: `
          <div
            style="
              max-width: 640px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #18181b;
            "
          >
            <div
              style="
                padding: 26px;
                border-radius: 18px 18px 0 0;
                background: #09090b;
                color: #ffffff;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #ef4444;
                  font-size: 12px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                "
              >
                New website enquiry
              </p>

              <h1
                style="
                  margin: 8px 0 0;
                  font-size: 28px;
                "
              >
                ${safeFullName}
              </h1>
            </div>

            <div
              style="
                padding: 26px;
                border: 1px solid #e4e4e7;
                border-top: 0;
                border-radius: 0 0 18px 18px;
                background: #ffffff;
              "
            >
              <p>
                <strong>Email:</strong>
                <a href="mailto:${safeEmail}">
                  ${safeEmail}
                </a>
              </p>

              <p>
                <strong>Phone:</strong>
                ${safePhone}
              </p>

              <p>
                <strong>Goal:</strong>
                ${safeGoal}
              </p>

              <p>
                <strong>Enquiry type:</strong>
                ${safeSubject}
              </p>

              <div
                style="
                  margin-top: 24px;
                  padding: 20px;
                  border-radius: 14px;
                  background: #f4f4f5;
                "
              >
                <p
                  style="
                    margin-top: 0;
                    font-weight: 700;
                  "
                >
                  Message
                </p>

                <p
                  style="
                    margin-bottom: 0;
                    white-space: pre-wrap;
                  "
                >
                  ${safeMessage}
                </p>
              </div>

              <p
                style="
                  margin-top: 24px;
                  color: #71717a;
                  font-size: 12px;
                "
              >
                Lead ID: ${safeLeadId}
              </p>

              <p
                style="
                  margin-bottom: 0;
                  color: #71717a;
                  font-size: 12px;
                "
              >
                Reply directly to this email to contact the lead.
              </p>
            </div>
          </div>
        `,
      });

    const acknowledgementEmailRequest =
      transporter.sendMail({
        from: fromAddress,
        to: {
          name: fullName,
          address: email,
        },
        replyTo:
          "info@tankzfitness.co.uk",
        subject:
          "We received your Tankz Fitness enquiry",
        text: [
          `Hi ${firstName},`,
          "",
          "Thank you for contacting Tankz Fitness.",
          "",
          "We have received your enquiry and a member of the team will be in touch shortly.",
          "",
          "If you need to add anything, simply reply to this email.",
          "",
          "Tankz Fitness",
          "info@tankzfitness.co.uk",
        ].join("\n"),
        html: `
          <div
            style="
              max-width: 640px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              line-height: 1.7;
              color: #18181b;
            "
          >
            <div
              style="
                padding: 28px;
                border-radius: 18px 18px 0 0;
                background: #09090b;
                color: #ffffff;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #ef4444;
                  font-size: 12px;
                  font-weight: 700;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                "
              >
                Tankz Fitness
              </p>

              <h1
                style="
                  margin: 8px 0 0;
                  font-size: 28px;
                "
              >
                Thanks for getting in touch
              </h1>
            </div>

            <div
              style="
                padding: 28px;
                border: 1px solid #e4e4e7;
                border-top: 0;
                border-radius: 0 0 18px 18px;
                background: #ffffff;
              "
            >
              <p>
                Hi ${safeFirstName},
              </p>

              <p>
                Thank you for contacting Tankz Fitness.
                We have received your enquiry and a member
                of the team will be in touch shortly.
              </p>

              <p>
                If you need to add anything, simply reply
                to this email.
              </p>

              <p style="margin-top: 28px;">
                <strong>Tankz Fitness</strong>
                <br />
                info@tankzfitness.co.uk
              </p>
            </div>
          </div>
        `,
      });

    const emailResults =
      await Promise.allSettled([
        notificationEmailRequest,
        acknowledgementEmailRequest,
      ]);

    emailResults.forEach(
      (result, index) => {
        if (
          result.status === "rejected"
        ) {
          console.error(
            index === 0
              ? "Lead notification email failed:"
              : "Customer acknowledgement email failed:",
            result.reason,
          );
        }
      },
    );
  } catch (error) {
    console.error(
      "The lead was saved, but the email system could not start:",
      error,
    );
  }

  revalidatePath("/admin/leads");
  revalidatePath("/contact");

  redirect("/contact?sent=1");
}