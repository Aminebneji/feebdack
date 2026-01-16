"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, LogOut, ChevronRight, Globe } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { classname } from "@/lib/utils";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";

interface SidebarProps {
    setIsCreateModalOpen: (open: boolean) => void;
    userEmail?: string | null;
    sites: any[];
}

export function Sidebar({ setIsCreateModalOpen, userEmail, sites }: SidebarProps) {
    const pathname = usePathname();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
    ];

    const currentSiteId = pathname.split("/").pop();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex flex-col z-30">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-7 h-7 transition-transform group-hover:rotate-12 duration-300">
                        <Image src="/assets/bdicon.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-primary">Feebdack</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div>
                    <div className="px-2 mb-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Menu</p>
                    </div>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={classname(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                                    item.active
                                        ? "bg-primary/5 text-primary border border-primary/10 shadow-sm"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="px-2 mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Projets</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="p-1.5 hover:bg-primary hover:text-white rounded-md text-muted-foreground transition-all"
                        >
                            <Plus className="size-3.5" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {sites.length === 0 ? (
                            <div className="px-3 py-4 text-center rounded-lg border border-dashed border-border/60">
                                <p className="text-xs text-muted-foreground">Aucun projet</p>
                            </div>
                        ) : (
                            sites.map((site) => (
                                <Link
                                    key={site.id}
                                    href={`/dashboard/${site.id}`}
                                    className={classname(
                                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                                        currentSiteId === site.id
                                            ? "bg-primary/5 text-primary border border-primary/10 shadow-sm"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <div className={classname(
                                            "size-1.5 rounded-full transition-all",
                                            currentSiteId === site.id ? "bg-primary scale-125" : "bg-muted-foreground/30"
                                        )} />
                                        <span className="truncate">{site.name}</span>
                                    </div>
                                    {currentSiteId === site.id && <ChevronRight className="size-3.5 opacity-50" />}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-border mt-auto space-y-2">
                {/* User Profile - Click to delete account */}
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-50 transition-all group"
                >
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                        {userEmail?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-zinc-900 truncate">{userEmail}</p>
                        <p className="text-[10px] text-muted-foreground font-semibold">Cliquez pour supprimer</p>
                    </div>
                </button>

                {/* Logout Button */}
                <button
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="size-4" />
                    Déconnexion
                </button>
            </div>

            {/* Delete Account Modal */}
            {userEmail && (
                <DeleteAccountModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    userEmail={userEmail}
                />
            )}
        </aside>
    );
}
