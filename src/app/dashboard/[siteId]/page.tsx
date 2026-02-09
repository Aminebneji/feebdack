"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { KanbanBoard } from "@/components/KanbanBoard";
import { SettingsView } from "@/components/SettingsView";
import { FeedbackDetailModal } from "@/components/FeedbackDetailModal";
import { Loader2, Kanban, Settings, ArrowLeft, Globe } from "lucide-react";
import { useSites } from "@/context/SitesContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { classname } from "@/lib/utils";
import { eventEmitter, EVENTS } from "@/lib/events";

interface Feedback {
    id: string;
    name: string;
    feature: string;
    content: string;
    status: string;
    createdAt: string;
}

export default function SiteDashboard() {
    const params = useParams();
    const router = useRouter();
    const siteId = params?.siteId as string;
    const { sites } = useSites();
    const { success, error: toastError, loading: toastLoading, dismiss } = useToast();

    const site = sites.find(s => s.id === siteId) || null;
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [view, setView] = useState<"kanban" | "settings">("kanban");
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const siteKey = site?.siteKey;

    const fetchFeedbacks = useCallback(async () => {
        if (!siteKey) return;
        setLoading(true);
        try {
            const feedbacksRes = await fetch(`/api/feedbacks?siteKey=${siteKey}`);
            const shouldUpdateFeedbacks = feedbacksRes.ok;

            if (shouldUpdateFeedbacks) {
                const data = await feedbacksRes.json();
                setFeedbacks(data);
            }
        } finally {
            setLoading(false);
        }
    }, [siteKey]);

    useEffect(() => {
        if (siteKey) fetchFeedbacks();
    }, [siteKey, fetchFeedbacks]);

    useEffect(() => {
        const off = eventEmitter.on(EVENTS.FEEDBACK_CHANGED, () => {
            fetchFeedbacks();
        });
        return () => off();
    }, [fetchFeedbacks]);

    const handleStatusUpdateSuccess = (id: string, newStatus: string) => {
        setFeedbacks(f => f.map(x => x.id === id ? { ...x, status: newStatus } : x));
        success("Statut mis à jour");
        eventEmitter.emit(EVENTS.FEEDBACK_CHANGED);
    };

    const updateFeedbackStatus = async (id: string, newStatus: string) => {
        const lid = toastLoading("Mise à jour...");
        try {
            const res = await fetch(`/api/feedbacks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) handleStatusUpdateSuccess(id, newStatus);
        } finally {
            dismiss(lid);
        }
    };

    const handleDeleteSuccess = (id: string) => {
        setFeedbacks(f => f.filter(x => x.id !== id));
        success("Feedback supprimé");
        eventEmitter.emit(EVENTS.FEEDBACK_CHANGED);
    };

    const confirmDelete = () => confirm("Supprimer ce feedback ?");

    const handleDeleteFeedback = async (id: string) => {
        const userConfirmed = confirmDelete();
        if (!userConfirmed) return;

        const lid = toastLoading("Suppression...");
        try {
            const res = await fetch(`/api/feedbacks/${id}`, { method: "DELETE" });
            if (res.ok) handleDeleteSuccess(id);
        } finally {
            dismiss(lid);
        }
    };

    const renderLoadingState = () => (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="size-8 animate-spin text-primary" />
        </div>
    );

    const renderNotFoundState = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 border">
                <Globe className="size-8" />
            </div>
            <h2 className="text-2xl font-black italic">Projet introuvable</h2>
            <Button variant="outline" className="rounded-full px-8 font-bold" onClick={() => router.push("/dashboard")}>
                Retour au dashboard
            </Button>
        </div>
    );

    const determinePageState = () => {
        const isLoading = loading && !site;
        const isNotFound = !site && !loading;

        if (isLoading) return renderLoadingState();
        if (isNotFound) return renderNotFoundState();
        return null;
    };

    const earlyReturn = determinePageState();
    if (earlyReturn) return earlyReturn;

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="p-3 bg-white hover:bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="size-5 text-primary" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tight text-zinc-900 group-hover:text-primary transition-colors">{site?.name}</h1>
                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Globe className="size-3 text-primary opacity-40" />
                            {site?.url}
                        </p>
                    </div>
                </div>

                <div className="flex items-center p-1.5 bg-white shadow-lg shadow-primary/5 rounded-2xl self-start md:self-auto border border-zinc-200">
                    <button
                        onClick={() => setView("kanban")}
                        className={classname(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            view === "kanban" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                    >
                        <Kanban className="size-3.5" />
                        Board
                    </button>
                    <button
                        onClick={() => setView("settings")}
                        className={classname(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            view === "settings" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                    >
                        <Settings className="size-3.5" />
                        Settings
                    </button>
                </div>
            </div>

            <div className="min-h-[500px]">
                {view === "kanban" ? (
                    <KanbanBoard
                        feedbacks={feedbacks}
                        onStatusChange={updateFeedbackStatus}
                        onDelete={handleDeleteFeedback}
                        onOpenFeedback={setSelectedFeedback}
                    />
                ) : (
                    <SettingsView site={site!} />
                )}
            </div>

            <FeedbackDetailModal
                feedback={selectedFeedback}
                onClose={() => setSelectedFeedback(null)}
            />
        </div>
    );
}
