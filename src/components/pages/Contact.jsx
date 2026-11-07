import ContactForm from "../common/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="site-page">
<div className="page-head"><div className="mono">12 — Get in touch</div><h1>Have a challenge?<br />Let’s build.</h1><p>For collaborations, sponsorships, research discussions or joining the team, reach out to UGV-DTU.</p></div>
 <div className="contact-layout"><div className="contact-panel"><h3>Contact the team</h3><div className="contact-line"><span className="mono">Email</span><strong><a href="mailto:ugv@dtu.ac.in">ugv@dtu.ac.in</a></strong></div><div className="contact-line"><span className="mono">Phone</span><strong><a href="tel:+917042011047">+91 70420 11047</a></strong></div><div className="contact-line"><span className="mono">Instagram</span><strong><a href="https://www.instagram.com/ugvdtu/" target="_blank" rel="noopener noreferrer">@ugvdtu ↗</a></strong></div></div>
 <div className="contact-panel"><h3>Find us at DTU</h3><div className="contact-line"><span className="mono">Workshop / Team space</span><strong>WT-3 and 4, Wind Tunnel</strong></div><div className="contact-line"><strong>Delhi Technological University</strong><span>Shahbad Daulatpur Village, Rohini, Delhi — 110042</span></div><p className="contact-note">Contact details shown here are based on UGV-DTU’s currently published official webpage. Confirm before launch if any details have changed.</p></div><div className="contact-panel map-panel"><div className="map-head"><h3>Locate UGV-DTU on the map</h3><a className="page-cta" href="https://www.google.com/maps/place/UGV-DTU/@28.7531454,77.1153118,17z/data=!3m1!4b1!4m6!3m5!1s0x390d0100360bf3c3:0x750933ba5ea3de86!8m2!3d28.7531454!4d77.1178867!16s%2Fg%2F11z_3p481z?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></div><div className="map-frame"><iframe title="Map of Delhi Technological University" src="https://www.google.com/maps?q=28.7531454,77.1178867&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe></div></div></div>
      <ContactForm />
    </section>
  );
}
