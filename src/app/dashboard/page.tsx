"use client";

import { Plus, Globe, Key, Trash2, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { useSites } from "@/context/SitesContext";
import { useToast } from "@/context/ToastContext";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardIndex() {
    const { sites, loading, deleteSite } = useSites();
    const { data: session } = useSession();
    const { loading: toastLoading, dismiss } = useToast();

    const handleDelete = async (id: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            confirm("Supprimer définitivement ce projet ?")
            const lid = toastLoading("Suppression...");
            const ok = await deleteSite(id);
            dismiss(lid);
        } catch (error) {
            console.error(error);
            Error("Erreur lors de la suppression");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 italic">Dashboard</h1>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                        Bienvenue, <span className="text-primary">{session?.user?.name || "capitaine"}</span>.
                    </p>
                </div>
                <Button className="h-11 px-6 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Plus className="mr-2 size-4" />
                    Nouveau Projet
                </Button>
            </div>

            {sites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-white border-2 border-dashed border-zinc-200 text-center space-y-4">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-primary/40 border border-zinc-100">
                        <Globe className="size-8" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">Prêt pour la récolte ?</h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Ajoutez votre site pour commencer à collecter des feedbacks.</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full px-6 font-bold">
                        Démarrer
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map((site) => (
                        <Link
                            key={site.id}
                            href={`/dashboard/${site.id}`}
                            className="group flex flex-col bg-white border border-zinc-200 rounded-2xl hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
                        >
                            <div className="p-6 space-y-5">
                                <div className="flex justify-between items-start">
                                    <div className="size-12 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                                        <Globe className="size-6 text-primary/60" />
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(site.id, e)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-xl font-black italic tracking-tight group-hover:text-primary transition-colors truncate">{site.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                                        <ExternalLink className="size-3" />
                                        {site.url.replace(/^https?:\/\//, "")}
                                    </p>
                                </div>

                                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between group-hover:bg-white transition-colors shadow-inner">
                                    <code className="text-[10px] font-mono font-bold text-zinc-500 truncate mr-2">{site.siteKey}</code>
                                    <Key className="size-3 text-zinc-400 shrink-0" />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 group-hover:bg-primary/5 transition-colors flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-primary/60">Ouvrir le tableau</span>
                                <ArrowRight className="size-4 text-primary opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
