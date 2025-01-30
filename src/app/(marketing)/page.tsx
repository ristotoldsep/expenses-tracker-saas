import PurchaseBtn from "@/components/purchase-btn";
import { prisma } from "@/lib/db";
import {
  getKindeServerSession,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const isLoggedIn = await isAuthenticated();
  let isPayingMember = false;

  const user = await getUser();

  if (user) {
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: "active",
      },
    });
    if (membership) {
      isPayingMember = true;
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10 px-5 text-white">
      <Image
        src="/expenses-tracker-cover.png"
        alt="Expenses Tracker app preview"
        width={700}
        height={472}
        className="rounded-md shadow-lg"
      />

      <div className="text-center xl:text-left">
        <h1 className="text-5xl font-bold my-6 max-w-[500px]">
          Track your <span className="text-[#5DC9A8]">expenses</span> with ease!
        </h1>

        <p className="text-xl text-gray-300 font-medium max-w-[600px]">
          Use Expenses Tracker to easily manage your spending. Get{" "}
          <span className="font-extrabold text-[#5DC9A8]">lifetime access</span>{" "}
          for only <span className="font-extrabold text-[22px]">1.99€</span>.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {!isLoggedIn ? (
            <>
              <LoginLink className="glow-button">Login</LoginLink>
              <RegisterLink className="glow-button glow-green">
                Register
              </RegisterLink>
            </>
          ) : !isPayingMember ? (
            <PurchaseBtn />
          ) : (
            <Link href="/app/dashboard" className="glow-button">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}