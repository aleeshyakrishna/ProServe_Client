"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FAQSection } from "@/components/common/FAQSection";
import { buttonVariants } from "@/components/ui/button";

// ------ Types & Constants ----------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

const QUICK_FAQS: FAQItem[] = [
  {
    question: "How do I book an appointment?",
    answer: "You can search for services or providers on our home page or services directory, select your preferred professional, choose an available date and time slot, and confirm your booking securely online."
  },
  {
    question: "What is your booking cancellation policy?",
    answer: "You can cancel or reschedule any booking free of charge up to 24 hours before the service start time. Cancellations made within 24 hours may be subject to a minor late-cancellation fee."
  },
  {
    question: "How are service providers vetted?",
    answer: "Every service provider on ProServe goes through a multi-step verification process, including Emirates ID check, trade license verification, experience checks, and customer service onboarding sessions."
  }
];

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Support",
    value: "support@proserve.ae",
    href: "mailto:support@proserve.ae",
    desc: "We respond within 2 hours"
  },
  {
    icon: Phone,
    label: "Phone Hotline",
    value: "+971 4 123 4567",
    href: "tel:+97141234567",
    desc: "Mon - Sun, 8am - 8pm"
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: "DTEC, Dubai Silicon Oasis, Dubai, UAE",
    href: "https://maps.google.com/?q=Dubai+Silicon+Oasis",
    desc: "Headquarters"
  },
  {
    icon: Clock,
    label: "Operational Hours",
    value: "Daily: 8:00 AM - 8:00 PM",
    href: null,
    desc: "Including public holidays"
  }
];

// ------ Main Component -------------------------------------

export default function ContactPage() {
  // Form Fields State
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  // Form Submission Status State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState("");

  // Validate form inputs
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errors.fullName = "Full Name must be at least 3 characters";
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!subject.trim() || subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }
    if (!message.trim() || message.trim().length < 15) {
      errors.message = "Message must be at least 15 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API network request delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-grow pt-16 lg:pt-18 bg-[var(--bg-primary)]">
        {/* ==========================================
            1. HERO SECTION
            ========================================== */}
        <section
          className="relative py-20 lg:py-28 overflow-hidden gradient-hero text-center"
          aria-labelledby="hero-title"
        >
          <div className="container-section flex flex-col items-center max-w-4xl relative z-10 gap-6">
            <Badge variant="secondary" className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 select-none animate-fade-in">
              Customer Support & Operations
            </Badge>

            <h1
              id="hero-title"
              className="text-display font-extrabold text-[var(--text-primary)] tracking-tight leading-none text-balance"
            >
              How Can We Help You <br />
              <span className="text-emerald-600">Today?</span>
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-2xl text-balance">
              Have questions about a booking, want to join as a partner, or need support? Send us a message and our team will get back to you shortly.
            </p>
          </div>
        </section>

        {/* ==========================================
            2. CONTACT INFORMATION & FORM GRID
            ========================================== */}
        <section className="section-padding bg-white border-y border-[var(--border-subtle)]" aria-label="Contact methods">
          <div className="container-section max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Contact details & Map */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="space-y-2">
                  <h2 className="text-[var(--text-primary)]">Contact Details</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Reach us directly via email, phone, or visit our headquarters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {CONTACT_INFO.map((info, idx) => {
                    const Icon = info.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
                      >
                        <div className="h-10 w-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">{info.label}</p>
                          {info.href ? (
                            <a
                              href={info.href}
                              target={info.icon === MapPin ? "_blank" : undefined}
                              rel={info.icon === MapPin ? "noopener noreferrer" : undefined}
                              className="text-xs font-bold text-[var(--text-primary)] hover:text-emerald-600 transition-colors block truncate"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{info.value}</p>
                          )}
                          <p className="text-[10px] text-[var(--text-secondary)] font-medium">{info.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Google Maps Embedded iframe */}
                <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-sm h-64 relative bg-[var(--bg-secondary)]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.0645604179357!2d55.37890697626402!3d25.133560633215886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f63be0b8d5a1b%3A0xe54e60b299e526a6!2sDubai%20Silicon%20Oasis!5e0!3m2!1sen!2sae!4v1703222384110!5m2!1sen!2sae"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    title="ProServe HQ Office Location Map"
                  />
                </div>
              </div>

              {/* Right Column: Contact form panel */}
              <div className="lg:col-span-7">
                {isSuccess ? (
                  <div className="rounded-3xl bg-[var(--bg-secondary)] border border-emerald-100 p-8 md:p-12 text-center shadow-md flex flex-col items-center gap-6 animate-fade-in">
                    <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base lg:text-lg font-bold text-[var(--text-primary)]">Message Sent Successfully!</h3>
                      <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto text-balance">
                        Thank you, <span className="font-bold text-[var(--text-primary)]">{fullName}</span>, for reaching out. We have logged your request and our support desk will contact you at <span className="font-bold text-[var(--text-primary)]">{email}</span> within 2 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFullName("");
                        setEmail("");
                        setPhone("");
                        setSubject("");
                        setMessage("");
                      }}
                      className={cn(buttonVariants({ variant: "outline", size: "md" }), "font-bold text-xs cursor-pointer")}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 md:p-8 space-y-5 shadow-sm"
                    noValidate
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <MessageSquare size={18} className="text-navy-950" />
                        Send Us a Message
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Fill out the support ticketing form and our dispatchers will respond shortly.</p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-600 leading-normal">
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="fullname-input" className="text-xs font-bold text-[var(--text-primary)]">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullname-input"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Fatima Al Mansoori"
                          className={cn(
                            "w-full h-10 px-3.5 rounded-xl border border-[var(--border-default)] bg-white text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500",
                            validationErrors.fullName && "border-red-500 focus:ring-red-400"
                          )}
                        />
                        {validationErrors.fullName && (
                          <p className="text-[10px] text-red-600 font-medium" role="alert">{validationErrors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="email-input" className="text-xs font-bold text-[var(--text-primary)]">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="fatima@example.com"
                          className={cn(
                            "w-full h-10 px-3.5 rounded-xl border border-[var(--border-default)] bg-white text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500",
                            validationErrors.email && "border-red-500 focus:ring-red-400"
                          )}
                        />
                        {validationErrors.email && (
                          <p className="text-[10px] text-red-600 font-medium" role="alert">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label htmlFor="phone-input" className="text-xs font-bold text-[var(--text-primary)]">
                          Phone Number <span className="text-[var(--text-disabled)] font-normal">(Optional)</span>
                        </label>
                        <input
                          id="phone-input"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +971 50 123 4567"
                          className="w-full h-10 px-3.5 rounded-xl border border-[var(--border-default)] bg-white text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label htmlFor="subject-input" className="text-xs font-bold text-[var(--text-primary)]">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="subject-input"
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Booking reference, support query, etc."
                          className={cn(
                            "w-full h-10 px-3.5 rounded-xl border border-[var(--border-default)] bg-white text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500",
                            validationErrors.subject && "border-red-500 focus:ring-red-400"
                          )}
                        />
                        {validationErrors.subject && (
                          <p className="text-[10px] text-red-600 font-medium" role="alert">{validationErrors.subject}</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message-textarea" className="text-xs font-bold text-[var(--text-primary)]">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message-textarea"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please write detailed details about your query..."
                        className={cn(
                          "w-full p-3.5 rounded-xl border border-[var(--border-default)] bg-white text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed",
                          validationErrors.message && "border-red-500 focus:ring-red-400"
                        )}
                      />
                      {validationErrors.message && (
                        <p className="text-[10px] text-red-600 font-medium" role="alert">{validationErrors.message}</p>
                      )}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        buttonVariants({ variant: "primary", size: "lg" }),
                        "w-full font-bold text-xs mt-2 relative flex items-center justify-center cursor-pointer"
                      )}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Send size={13} />
                          <span>Submit Message</span>
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
            3. FAQ PREVIEW SECTION
            ========================================== */}
        <FAQSection
          title="Common Questions"
          subtitle="Find immediate answers to standard platform support queries."
          categoryLabel="FAQ Desk"
          items={QUICK_FAQS}
          bgClassName="bg-white"
        />

        {/* ==========================================
            4. CALL TO ACTION (CTA)
            ========================================== */}
        <section className="section-padding bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]" aria-label="Contact page cta block">
          <div className="container-section">
            <div className="rounded-3xl gradient-navy text-white p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl flex flex-col items-center gap-6">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl" />

              <h2 className="text-display font-extrabold text-white text-balance leading-tight">
                Ready to book your next home service?
              </h2>

              <p className="text-navy-100 text-sm lg:text-base max-w-xl mx-auto text-balance">
                Book our vetted specialists instantly, or sign up as a service partner to grow your operations.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <Link
                  href="/services"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs bg-emerald-50 text-navy-900 hover:bg-white transition-colors shadow-lg cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                >
                  Browse Services
                </Link>
                <Link
                  href="/providers/join"
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs border border-white/20 text-white hover:bg-white/10 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                >
                  Join as a Partner
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
