import Banner from "../_components/Banner";
import ContactSection from "../_components/ContactSection";
import { getDictionary } from "../_lib/i18n";

export const metadata = {
  title: "Contact Us",
  description: "Reach out to the Hotel Booking App ",
};

async function Page() {
  const dict = (await getDictionary()).contact;
  return (
    <>
      <Banner title={dict.bannerTitle} />
      <ContactSection />
    </>
  );
}

export default Page;
