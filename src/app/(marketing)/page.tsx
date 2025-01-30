import FrontHeader from "@/components/FrontHeader/FrontHeader";
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
      <FrontHeader isLoggedIn={isLoggedIn} isPayingMember={isPayingMember} />
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10 px-5 text-white">
        <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-2 lg:gap-10">
          <Image
            src="/rahavoog_cover.webp"
            alt="Expenses Tracker app preview"
            width={700}
            height={472}
            className="rounded-md shadow-lg"
            priority
          />

          <div className="text-center xl:text-left d-flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold my-6 max-w-[500px]">
              Jälgige oma <span className="text-[#5DC9A8]">rahavooge</span> lihtsalt & mugavalt!
            </h1>

            <p className="text-xl text-gray-300 font-medium max-w-[600px]">
              Saage täielik ülevaade oma rahavoogudest – <br /> {" "}
              <span className="font-extrabold text-[#5DC9A8]">eluaegne ligipääs</span>{" "}
              vaid <span className="font-extrabold text-[22px]">1.99€</span> eest.
            </p>

            <div className="mt-10 flex flex-col justify-center lg:flex-row xl:justify-start gap-4">
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