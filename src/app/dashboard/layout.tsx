"use client";

import { useSession } from "next-auth/react";
import CreateSiteModal from "@/components/CreateSiteModal";
import { Sidebar } from "@/components/Sidebar";
import MobileGuard from "@/components/MobileGuard";
import { SitesProvider, useSites } from "@/context/SitesContext";
import { CreateModalProvider, useCreateModal } from "@/context/CreateModalContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { sites } = useSites();
    const { isCreateModalOpen, setIsCreateModalOpen } = useCreateModal();

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <MobileGuard />
            <Sidebar
                setIsCreateModalOpen={setIsCreateModalOpen}
                userEmail={session?.user?.email}
                sites={sites}
            />

            <main className="pl-64 min-h-screen flex flex-col">
                <div className="flex-1 p-8 overflow-y-auto">
                    {children}
                </div>
            </main>

            <CreateSiteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SitesProvider>
            <CreateModalProvider>
                <DashboardContent>{children}</DashboardContent>
            </CreateModalProvider>
        </SitesProvider>
    );
}
