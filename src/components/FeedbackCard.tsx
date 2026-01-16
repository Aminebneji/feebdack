"use client";

import { Clock, User, Tag, MoveRight, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feedback {
    id: string;
    name: string;
    feature: string;
    content: string;
    status: string;
    createdAt: string;
}

interface FeedbackCardProps {
    feedback: Feedback;
    onStatusChange: (id: string, newStatus: string) => void;
    onDelete: (id: string) => void;
}

export function FeedbackCard({ feedback, onStatusChange, onDelete }: FeedbackCardProps) {
    const nextStatus = feedback.status === "À traiter" ? "En cours" : "Terminé";

    return (
        <Card
            className="bg-white hover:border-primary/40 transition-all rounded-xl shadow-sm hover:shadow-xl hover:shadow-primary/5 group border border-zinc-100"
        >
            <CardContent className="p-2 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 flex items-center gap-2">
                        {feedback.feature}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(feedback.id);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>

                <p className="text-sm leading-relaxed text-zinc-700 font-bold italic">
                    &ldquo;{feedback.content}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                    <div className="flex items-center gap-2.5">
                        <div className="size-7 bg-zinc-50 rounded-lg flex items-center justify-center text-primary/30 border border-zinc-100 shadow-inner">
                            <User className="size-3.5" />
                        </div>
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-tight">
                            {feedback.name}
                        </span>
                    </div>

                    {feedback.status !== "Terminé" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(feedback.id, nextStatus);
                            }}
                            className="text-[10px] font-black text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-all p-1.5 hover:bg-primary/5 rounded-lg group/btn"
                        >
                            {nextStatus === "En cours" ? "Suivant" : "Clôturer"}
                            <MoveRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
