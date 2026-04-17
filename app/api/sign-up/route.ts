// app/api/sign-up/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName, lastName, email, phone,
      dob, address, city, state, zip, accountType,
    } = body;

    // Validate required fields server-side
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email to you via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from:    `"Valemont Crest Investment Bank Sign-Up" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER, // sends to yourself
      subject: `New account application — ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
            .card { background: #ffffff; border-radius: 16px; max-width: 560px; margin: 0 auto; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%); padding: 28px 32px; color: white; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
            .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.75; }
            .body { padding: 28px 32px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 0 0 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
            .field { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
            .field label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 3px; }
            .field span { font-size: 14px; font-weight: 600; color: #1e293b; }
            .full { grid-column: 1 / -1; }
            .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: capitalize; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 11px; color: #94a3b8; }
            .timestamp { font-size: 11px; color: #94a3b8; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>New account application</h1>
              <p>A new customer has submitted an account opening request</p>
            </div>
            <div class="body">

              <p class="section-title">Personal details</p>
              <div class="grid">
                <div class="field">
                  <label>First name</label>
                  <span>${firstName}</span>
                </div>
                <div class="field">
                  <label>Last name</label>
                  <span>${lastName}</span>
                </div>
                <div class="field full">
                  <label>Email address</label>
                  <span>${email}</span>
                </div>
                <div class="field">
                  <label>Phone number</label>
                  <span>${phone || "—"}</span>
                </div>
                <div class="field">
                  <label>Date of birth</label>
                  <span>${dob ? new Date(dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}</span>
                </div>
              </div>

              <p class="section-title">Address</p>
              <div class="grid">
                <div class="field full">
                  <label>Street address</label>
                  <span>${address || "—"}</span>
                </div>
                <div class="field">
                  <label>City</label>
                  <span>${city || "—"}</span>
                </div>
                <div class="field">
                  <label>State</label>
                  <span>${state || "—"}</span>
                </div>
                <div class="field">
                  <label>ZIP code</label>
                  <span>${zip || "—"}</span>
                </div>
                <div class="field">
                  <label>Account type requested</label>
                  <span class="badge">${accountType}</span>
                </div>
              </div>

            </div>
            <div class="footer">
              <strong>SecureBank</strong> · Account Applications · This email was generated automatically.
              <br/>
              <span class="timestamp">Submitted: ${new Date().toLocaleString("en-US", {
                weekday: "long", year: "numeric", month: "long",
                day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short",
              })}</span>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Also send a confirmation email to the applicant
    await transporter.sendMail({
      from:    `"SecureBank" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: `We received your application, ${firstName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
            .card { background: #ffffff; border-radius: 16px; max-width: 520px; margin: 0 auto; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%); padding: 32px; color: white; text-align: center; }
            .header h1 { margin: 0 0 6px; font-size: 22px; font-weight: 700; }
            .header p { margin: 0; font-size: 14px; opacity: 0.8; }
            .body { padding: 32px; }
            .body p { font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 16px; }
            .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
            .step-num { width: 24px; height: 24px; background: #dbeafe; color: #1d4ed8; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
            .step-text { font-size: 13px; color: #475569; line-height: 1.5; }
            .cta { display: block; text-align: center; background: #1d4ed8; color: white; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; margin: 24px 0 0; }
            .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Application received!</h1>
              <p>Hi ${firstName}, we've got your details</p>
            </div>
            <div class="body">
              <p>
                Thank you for applying to open a <strong>${accountType} account</strong> with SecureBank.
                Your application is now under review and we'll be in touch within <strong>24 hours</strong>.
              </p>
              <p style="font-size:13px;font-weight:600;color:#1e293b;margin-bottom:12px;">What happens next:</p>
              ${[
                "We securely verify your identity using the details you provided",
                "Your account is activated — usually within 24 hours",
                "You receive your debit card in 5–7 business days",
                "Sign in and start banking right away",
              ].map((step, i) => `
                <div class="step">
                  <div class="step-num">${i + 1}</div>
                  <div class="step-text">${step}</div>
                </div>
              `).join("")}
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://valemontcrest.com"}/sign-in" class="cta">
                Go to sign in →
              </a>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} SecureBank. FDIC Insured. Member FDIC.
              <br/>Questions? Reply to this email or call 1-800-555-0199.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // This always throws so the Sonner "system down" toast always fires
    // Remove this throw and return success once your backend is ready
    throw new Error("SYSTEM_DOWN");

  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message ?? "";

    // If it's our intentional system-down error, return 503
    if (msg === "SYSTEM_DOWN") {
      return NextResponse.json(
        { error: "System currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

    console.error("Sign-up error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}