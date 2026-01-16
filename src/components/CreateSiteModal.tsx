"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSites } from "@/context/SitesContext";
import { useToast } from "@/context/ToastContext";

interface CreateSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateSiteModal({ isOpen, onClose }: CreateSiteModalProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const { addSite } = useSites();
    const { success, error: toastError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/sites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, url }),
            });

            if (res.ok) {
                const newSite = await res.json();
                addSite(newSite);
                success("Project Created");
                onClose();
                setName("");
                setUrl("");
            } else {
                const data = await res.json();
                toastError(data.error || "Error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-border bg-background shadow-2xl rounded-lg p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-xl font-bold tracking-tight">Nouveau site</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                Connectez votre site web
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    Nom du site
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Mon site"
                                    className="h-9 rounded-md border-border bg-muted/20 text-sm font-medium focus-visible:ring-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    URL du site
                                </label>
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    type="url"
                                    className="h-9 rounded-md border-border bg-muted/20 text-sm font-medium focus-visible:ring-foreground"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 p-4 border-t border-border flex flex-row gap-2 justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-[10px] font-bold uppercase tracking-widest"
                            disabled={loading}
                        >
                            annuler
                        </Button>
                        <Button
                            type="submit"
                            className="h-9 px-6 rounded-md font-bold uppercase tracking-widest text-[10px] bg-primary text-background hover:bg-foreground/90 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                "suivre le site"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
