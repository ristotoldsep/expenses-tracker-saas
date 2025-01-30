import LogoutBtn from "@/components/AccountPage/LogoutBtn";
import { checkAuthenticationAndMembership } from "@/lib/server-utils";
import Image from "next/image";

export default async function Page() {
  const user = await checkAuthenticationAndMembership();

  return (
    <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-lg p-8 text-white text-center">
      {/* Profile Picture */}
      {user.picture && (
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#5DC9A8] shadow-md">
          <Image 
            src={user.picture} 
            alt={`${user.given_name} ${user.family_name}`} 
            width={96} 
            height={96} 
            className="object-cover"
          />
        </div>
      )}

      {/* User Info */}
      <h1 className="text-2xl font-semibold mt-4">
        {user.given_name} {user.family_name}
      </h1>
      <p className="text-gray-300 text-sm mt-2">
        📧 <span className="font-medium">{user.email}</span>
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button className="px-4 py-2 bg-[#5DC9A8] text-black font-medium rounded-lg hover:bg-[#4cb292] transition">
          Muuda profiili
        </button>
        <LogoutBtn />
      </div>
    </div>
  );
}