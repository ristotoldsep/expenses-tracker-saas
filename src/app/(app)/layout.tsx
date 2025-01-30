import AppHeader from "@/components/app-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-y-10 max-w-[1300px] mx-auto px-5 min-h-screen">
            <AppHeader />
            <main className="flex justify-center">{children}</main>
        </div>
    );
}