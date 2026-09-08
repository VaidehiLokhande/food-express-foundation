import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  Landmark,
  Wallet,
  Receipt,
} from "lucide-react";
import { foundation } from "../data/content";

const AMOUNTS = [
  { v: 500, label: "₹500", tag: "🍱 Helps provide basic food support" },
  { v: 1000, label: "₹1,000", tag: "🩺 Supports charitable assistance" },
  { v: 2500, label: "₹2,500", tag: "🎒 Supports educational needs" },
  { v: 5000, label: "₹5,000", tag: "🏕️ Supports relief activities" },
];

export default function Donate() {
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");

  const [pan, setPan] = useState("");

  const [donor, setDonor] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const finalAmount = custom ? Number(custom) : amount;

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!finalAmount || finalAmount < 10) {
      setError("Please choose or enter an amount of at least ₹10.");
      return;
    }

    if (!donor.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!donor.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!donor.phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(donor.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    /*
      STEP 1 ONLY

      The actual payment gateway will be connected in Step 2.

      Flow after integration:

      React Donate Page
              ↓
      Java Spring Boot Backend
              ↓
      Cashfree Secure Checkout
              ↓
      UPI / Card / Net Banking / Wallet
    */

    alert(
      `Donation details are ready.\n\nAmount: ₹${finalAmount.toLocaleString(
        "en-IN"
      )}\nDonor: ${donor.name}\n\nSecure payment gateway will be connected in Step 2.`
    );
  }

  return (
    <form className="pay-box" onSubmit={handleContinue}>
      {/* Header */}
      <div className="pay-head">
        <div>
          <h3>Choose your contribution</h3>
          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Every contribution can help support our charitable activities.
          </p>
        </div>

        <span className="pay-secure">
          <Lock size={12} />
          Secure
        </span>
      </div>

      {/* Amount Selection */}
      <div className="amounts emoji-amounts">
        {AMOUNTS.map((a) => (
          <button
            type="button"
            key={a.v}
            className={
              amount === a.v && !custom ? "active" : ""
            }
            onClick={() => {
              setAmount(a.v);
              setCustom("");
            }}
          >
            <b>{a.label}</b>
            <small>{a.tag}</small>
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <input
        className="pay-custom"
        type="text"
        inputMode="numeric"
        placeholder="✍️ Enter custom amount (₹)"
        value={custom}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setCustom(value);
        }}
      />

      {/* Payment Gateway Information */}
      <div
        style={{
          marginTop: "22px",
          padding: "18px",
          borderRadius: "14px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <ShieldCheck size={20} />
          <strong>Secure online payment</strong>
        </div>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          After you continue, you will be redirected to a secure
          payment gateway where available payment methods such as
          UPI, cards, net banking and wallets can be selected.
        </p>

        <div
          className="upi-badges"
          style={{ marginTop: "14px" }}
        >
          <span>
            <Smartphone size={14} /> UPI
          </span>
          <span>
            <CreditCard size={14} /> Cards
          </span>
          <span>
            <Landmark size={14} /> Net Banking
          </span>
          <span>
            <Wallet size={14} /> Wallets
          </span>
        </div>
      </div>

      {/* Donor Details */}
      <div
        style={{
          marginTop: "24px",
          marginBottom: "12px",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: "18px",
          }}
        >
          Your Details
        </h4>

        <p
          style={{
            margin: "5px 0 0",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          These details may be used for your donation record and receipt.
        </p>
      </div>

      <div className="pay-donor">
        <input
          type="text"
          placeholder="Full name"
          value={donor.name}
          onChange={(e) =>
            setDonor({
              ...donor,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email (for receipt)"
          value={donor.email}
          onChange={(e) =>
            setDonor({
              ...donor,
              email: e.target.value,
            })
          }
        />

        <input
          type="tel"
          placeholder="Mobile number"
          maxLength={10}
          inputMode="numeric"
          value={donor.phone}
          onChange={(e) =>
            setDonor({
              ...donor,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        <input
          type="text"
          placeholder="PAN (optional)"
          maxLength={10}
          value={pan}
          onChange={(e) =>
            setPan(e.target.value.toUpperCase())
          }
        />
      </div>

      {/* Error */}
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      {/* Continue Button */}
      <button
        type="submit"
        className="donate full pay-btn"
      >
        Continue to Secure Payment 🔒
      </button>

      {/* Security */}
      <div className="pay-trust">
        <span>
          <ShieldCheck size={13} />
          Secure Payment
        </span>

        <span>
          <Receipt size={13} />
          Donation Receipt
        </span>

        <span>
          🇮🇳 India Donations
        </span>
      </div>

      {/* Important note */}
      <p className="pay-fineprint">
        Online donations are currently intended for contributions
        within India. The secure payment gateway will be connected
        to this page in the next step. For donation enquiries, contact{" "}
        <a
          href={`mailto:${foundation.donationsEmail}`}
        >
          {foundation.donationsEmail}
        </a>
        .
      </p>
    </form>
  );
}