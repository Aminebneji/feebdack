"use client";

import { useState } from "react";
import { Copy, Check, Code, Trash2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { useSites } from "@/context/SitesContext";

interface Site {
    id: string;
    name: string;
    url: string;
    siteKey: string;
    createdAt: string;
}

interface SettingsViewProps {
    site: Site;
}

export function SettingsView({ site }: SettingsViewProps) {
    const { success, loading: toastLoading, dismiss } = useToast();
    const { deleteSite } = useSites();
    const [copied, setCopied] = useState(false);

    const handleDelete = async (id: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            if (confirm("Supprimer définitivement ce projet ?")) {
                const lid = toastLoading("Suppression...");
                await deleteSite(id);
                dismiss(lid);
                success("Projet supprimé")
            }
        } catch (error) {
            console.error(error);
            Error("Erreur lors de la suppression");
        }
    };

    const copyScript = () => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const script = `<script src="${origin}/widget.js" async data-site-key="${site.siteKey}"></script>`;
        navigator.clipboard.writeText(script);
        setCopied(true);
        success("Script copié");
        setTimeout(() => setCopied(false), 2000);
    };

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Site Information */}
                <Card className="border-2 border-zinc-100 bg-white shadow-xl shadow-primary/5 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-4">Nom du Site</label>
                            <div className="h-10 rounded-xl border-2 border-zinc-50 bg-zinc-50/50 text-sm font-bold px-4 flex items-center shadow-inner">
                                {site.name}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-4">URL du Site</label>
                            <div className="h-10 rounded-xl border-2 border-zinc-50 bg-zinc-50/50 text-sm font-bold px-4 flex items-center shadow-inner">
                                {site.url}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="border-2 border-zinc-100 bg-white shadow-xl shadow-primary/5 rounded-2xl overflow-hidden flex flex-col">
                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-primary/5 flex items-center justify-between group shadow-inner">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <span className="text-[9px] font-black uppercase text-primary/40 tracking-widest">Clé API Unique</span>
                                <code className="font-mono text-xs font-bold text-zinc-900 truncate pr-4">{site.siteKey}</code>
                            </div>
                            <button onClick={() => { navigator.clipboard.writeText(site.siteKey); success("Clé copiée"); }} className="p-3 bg-white hover:bg-zinc-100 rounded-xl shadow-sm border border-zinc-100 transition-all">
                                <Copy className="size-4 text-primary/60" />
                            </button>
                        </div>
                        <button
                            onClick={(e) => handleDelete(site.id, e)}
                            className="w-full h-10 flex items-center justify-center gap-2 border-2 border-rose-50 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <Trash2 className="size-4" /> Supprimer le Projet
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Widget Integration */}
            <CardTitle className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-3">
                <Code className="size-5" /> Installation du Widget
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-2 font-bold">Installez le widget sur votre site en ajoutant le code ci-dessous dans votre code source, assurez vous d'avoir renseigné le bon url de votre site dans le champ URL du site ici</p>
            <CardContent className="p-6 space-y-3">
                <div className="relative group">
                    <pre className="bg-[#18181b] text-emerald-400 p-6 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border-2 border-zinc-800 shadow-xl">
                        {`<script 
  src="${origin}/widget.js" 
  async 
  data-site-key="${site.siteKey}"
></script>`}
                    </pre>
                    <button
                        className="absolute top-4 right-4 p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all shadow-lg border border-zinc-700"
                        onClick={copyScript}
                    >
                        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                </div>
            </CardContent>
        </div>
    );
}
