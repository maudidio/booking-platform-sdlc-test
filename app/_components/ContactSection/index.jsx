import Heading from "@/app/_ui/Heading";
import ContactForm from "../ContactForm";
import ContactMap from "../ContactMap";
import styles from "./styles.module.css";
import { contactAction } from "@/app/_lib/actions";
import { getDictionary } from "@/app/_lib/i18n";

async function ContactSection() {
  const dict = (await getDictionary()).contact;
  return (
    <section className={styles.contactSection}>
      <div className="container">
        <Heading className={`text-center ${styles.heading}`}>
          {dict.heading}
        </Heading>
        <div className={`${styles.contactContainer}`}>
          <ContactForm contactAction={contactAction} dict={dict} />
          <ContactMap />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
