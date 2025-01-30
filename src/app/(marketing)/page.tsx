import FrontHeader from "@/components/front-header";
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
    <>
      <FrontHeader />
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10 px-5 text-white">
        <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-10">
          <Image
            src="/expenses-tracker-cover.png"
            alt="Expenses Tracker app preview"
            width={700}
            height={472}
            className="rounded-md shadow-lg"
            priority
          />

          <div className="text-center xl:text-left">
            <h1 className="text-5xl font-bold my-6 max-w-[500px]">
              Jälgige oma <span className="text-[#5DC9A8]">rahavooge</span> lihtsalt & mugavalt!
            </h1>

            <p className="text-xl text-gray-300 font-medium max-w-[600px]">
              Saage täielik ülevaade oma rahavoogudest – <br /> {" "}
              <span className="font-extrabold text-[#5DC9A8]">eluaegne ligipääs</span>{" "}
              vaid <span className="font-extrabold text-[22px]">1.99€</span> eest.
            </p>

            <div className="mt-10 flex flex-col lg:flex-row gap-4">
              {!isLoggedIn ? (
                <>
                  <LoginLink className="glow-button">Logi sisse</LoginLink>
                  <RegisterLink className="glow-button glow-green">
                    Registreeri
                  </RegisterLink>
                </>
              ) : !isPayingMember ? (
                <PurchaseBtn />
              ) : (
                <Link href="/app/dashboard" className="glow-button">
                  Mine töölauale
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}