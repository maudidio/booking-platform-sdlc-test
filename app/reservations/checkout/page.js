import Banner from "@/app/_components/Banner";
import CheckoutForm from "./_components/CheckoutSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/_lib/i18n";

export const metadata = {
  title: "Reservation Checkout",
  description: "Checkout your reservation and let yourself have a good stay with us",
};

async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  const dict = (await getDictionary()).checkout;

  return (
    <>
      <Banner title={dict.banner} />
      <CheckoutForm />
    </>
  );
}

export default Page;
