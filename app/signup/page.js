import { redirect } from "next/navigation";
import SignUpForm from "@/app/signup/_components/SignUpForm";
import { auth } from "@/auth";
import Banner from "../_components/Banner";
import { cookies } from "next/headers";
import { getDictionary } from "../_lib/i18n";

export const metadata = {
  title: "Sign Up",
  description: "Sign Up to the Hotel Booking App ",
};

async function Page() {
  const session = await auth();
  const redirectURL = cookies().has("pending_reservation") ? "/reservations/checkout" : "/account/history";
  if (session?.user) redirect(redirectURL);

  const dict = (await getDictionary()).auth;

  return (
    <>
      <Banner title={dict.registerBanner} />
      <SignUpForm />
    </>
  );
}

export default Page;
