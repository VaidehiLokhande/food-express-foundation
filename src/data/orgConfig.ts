// ─────────────────────────────────────────────────────────────
// Central place to manage the Foundation's real-world contact &
// bank details. Update the two placeholders marked "TODO" below
// with the actual office phone / WhatsApp number — everything
// else (donation modal, SMS button, WhatsApp button, footer)
// reads from here automatically.
// ─────────────────────────────────────────────────────────────

export const orgConfig = {
  // TODO: replace with the Foundation's real 10-digit phone number.
  // Used for the "Send Message" SMS button and the WhatsApp button.
  phone: "9324421009",
  countryCode: "+91",

  email: "foodexpressfoundation@gmail.com",

  address: "C/o Mr. Sunil Maruti Pawar, Vruddhaashram Road, Near Hanuman Mandir, Aptewadi, Shirgaon, Badlapur (E), Thane – 421503",

  bank: {
    accountName: "FOOD EXPRESS FOUNDATION",
    accountNumber: "923020011559409",
    ifsc: "UTIB0001572",
    bankName: "Axis Bank Ltd.",
    branch: "Kandivali (W), Link Road, Mumbai - 400067",
    accountType: "Current / Trust Account",
    pan: "AAATF9151D",
  },
};

// Builds an Outlook Web compose link so clicking an email address on the
// site opens Outlook (outlook.office.com) directly with the address,
// subject & body pre-filled — instead of relying on whatever mail app
// the visitor's device has set as default.
export const outlookComposeLink = (subject = "", body = "") =>
  `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(orgConfig.email)}` +
  (subject ? `&subject=${encodeURIComponent(subject)}` : "") +
  (body ? `&body=${encodeURIComponent(body)}` : "");
