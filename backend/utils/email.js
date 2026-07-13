const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendEmail({ to, subject, text }) {
  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent to", to);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
}

async function notifyCampaignApproval(email, campaignTitle) {
  await sendEmail({
    to: email,
    subject: "Campaign Approved - FundForge",
    text: `Congratulations! Your campaign "${campaignTitle}" has been approved and is now visible to supporters.`,
  });
}

async function notifyCampaignRejection(email, campaignTitle) {
  await sendEmail({
    to: email,
    subject: "Campaign Rejected - FundForge",
    text: `Your campaign "${campaignTitle}" has been rejected by the admin. Please review and resubmit.`,
  });
}

async function notifyContributionConfirmation(email, campaignTitle, amount) {
  await sendEmail({
    to: email,
    subject: "Contribution Received - FundForge",
    text: `A supporter has contributed ${amount} credits to your campaign "${campaignTitle}".`,
  });
}

async function notifyWithdrawalProcessed(email, amount) {
  await sendEmail({
    to: email,
    subject: "Withdrawal Processed - FundForge",
    text: `Your withdrawal of $${amount} has been processed successfully.`,
  });
}

module.exports = { notifyCampaignApproval, notifyCampaignRejection, notifyContributionConfirmation, notifyWithdrawalProcessed };
