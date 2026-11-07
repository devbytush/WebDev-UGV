import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="contact-panel contact-form-panel">
      <div className="contact-form-heading">
        <h3>Send the team a message</h3>
        <p>Share a few details and we’ll be in touch.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="contact-form-wide">
          <span>Subject</span>
          <input name="subject" type="text" placeholder="What would you like to discuss?" required />
        </label>
        <label className="contact-form-wide">
          <span>Message</span>
          <textarea name="message" rows="5" placeholder="Write your message..." required />
        </label>
        <div className="contact-form-actions contact-form-wide">
          <button className="btn p" type="submit">Send message <span aria-hidden="true">↗</span></button>
          <p className="contact-form-note" role="status" aria-live="polite">
            {submitted
              ? "Thanks — message delivery will be enabled soon."
              : "Message sending is not connected yet."}
          </p>
        </div>
      </form>
    </div>
  );
}
