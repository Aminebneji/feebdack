"use client";

import { X, Clock, User, Tag, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Feedback {
    id: string;
    name: string;
    feature: string;
    content: string;
    status: string;
    createdAt: string;
}

interface FeedbackDetailModalProps {
    feedback: Feedback | null;
    onClose: () => void;
}

export function FeedbackDetailModal({ feedback, onClose }: FeedbackDetailModalProps) {
    if (!feedback) return null;

    return (
        <Dialog open={!!feedback} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] border border-zinc-200 bg-white shadow-lg rounded-2xl p-0 overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex flex-col flex-1 overflow-hidden">


                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-10 space-y-8">
                            <DialogHeader className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 leading-none flex items-center gap-2">
                                        {feedback.feature}
                                    </span>
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none italic opacity-40">
                                        {feedback.status}
                                    </div>
                                </div>
                                <DialogTitle className="text-2xl font-black italic tracking-tight text-zinc-900 leading-tight">
                                    Feedback de {feedback.name}
                                </DialogTitle>
                            </DialogHeader>

                            {/* Feedback content - now with more space */}
                            <div className="text-zinc-700 leading-relaxed text-xl font-medium py-4">
                                {feedback.content}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-zinc-100">
                                <div className="flex items-center gap-2">
                                    <User className="size-4" />
                                    <span>{feedback.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    <span>{format(new Date(feedback.createdAt), "d MMM yyyy", { locale: fr })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
