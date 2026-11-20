import { redirect } from "next/navigation";
import SigninForm from "./_components/SigninForm";
import { auth } from "@/auth";
import Banner from "../_components/Banner";
import { getDictionary } from "../_lib/i18n";

export const metadata = {
  title: "Sign In",
  description: "Sign In to the Hotel Booking App ",
};

async function Page() {
  const session = await auth();
  if (session?.user) redirect("/account/history");

  const dict = (await getDictionary()).auth;

  return (
    <>
      <Banner title={dict.signInBanner} />
      <SigninForm />
    </>
  );
}

export default Page;
