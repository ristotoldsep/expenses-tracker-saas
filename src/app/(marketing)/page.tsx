import FrontHeader from "@/components/FrontHeader/FrontHeader";
import PurchaseBtn from "@/components/PurchaseBtn";
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
      <div className="min-h-screen flex flex-col xl:flex-row items-center justify-center gap-10 text-white py-[100px] relative">
      <div className="absolute -z-1 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-[1300px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-2 lg:gap-10 px-5">
          <Image
            src="/rahavoog_cover.webp"
            alt="Expenses Tracker app preview"
            width={700}
            height={472}
            style={{ width: "auto", height: "auto" }}
            className="rounded-xl shadow-lg opacity-0 animate-fade-in max-w-[100%] xl:max-w-[50%] max-h-[300px] md:max-h-[400px] xl:max-h-[none]"
            priority
          />

          <div className="text-center xl:text-left d-flex flex-col justify-center flex-1 max-w-[100%] xl:max-w-[50%]">
            <h1 className="text-4xl lg:text-5xl font-bold my-6 max-w-[500px] opacity-0 animate-fade-in">
              Jälgige oma <span className="text-[#5DC9A8]">rahavooge</span> lihtsalt & mugavalt!
            </h1>

            <p className="text-xl text-gray-300 font-medium max-w-[600px] opacity-0 animate-fade-in">
              Saage täielik ülevaade oma rahavoogudest – <br /> {" "}
              <span className="font-extrabold text-[#5DC9A8]">eluaegne ligipääs</span>{" "}
              vaid <span className="font-extrabold text-[22px]">1.99€</span> eest.
            </p>

            <div className="mt-10 flex flex-col justify-center lg:flex-row xl:justify-start gap-4 opacity-0 animate-fade-in">
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