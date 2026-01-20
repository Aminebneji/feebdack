"use client";

import { useState, useEffect } from "react";
import { FeedbackCard } from "./FeedbackCard";

interface Feedback {
    id: string;
    name: string;
    feature: string;
    content: string;
    status: string;
    createdAt: string;
}

interface KanbanBoardProps {
    feedbacks: Feedback[];
    onStatusChange: (id: string, newStatus: string) => void;
    onDelete: (id: string) => void;
    onOpenFeedback: (feedback: Feedback) => void;
}

const COLUMNS = [
    { id: "À traiter", title: "À traiter" },
    { id: "En cours", title: "En cours" },
    { id: "Terminé", title: "Terminé" },
];

export function KanbanBoard({ feedbacks, onStatusChange, onDelete, onOpenFeedback }: KanbanBoardProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, feedbackId: string) => {
        setDraggedId(feedbackId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", feedbackId);

        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "0.5";
        }
    };

    const handleDragEnd = (event: React.DragEvent) => {
        setDraggedId(null);
        setDragOverColumn(null);

        if (event.currentTarget instanceof HTMLElement) {
            event.currentTarget.style.opacity = "1";
        }
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const feedbackId = e.dataTransfer.getData("text/plain");

        if (feedbackId) {
            const feedback = feedbacks.find(f => f.id === feedbackId);
            if (feedback && feedback.status !== newStatus) {
                onStatusChange(feedbackId, newStatus);
            }
        }

        setDraggedId(null);
        setDragOverColumn(null);
    };

    const handleCardClick = (feedback: Feedback) => {
        if (!draggedId) {
            onOpenFeedback(feedback);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLUMNS.map((column) => (
                <div
                    key={column.id}
                    className={`flex flex-col bg-zinc-50 border border-zinc-200 rounded-2xl p-5 min-h-[600px] shadow-inner transition-all ${dragOverColumn === column.id ? "ring-2 ring-primary/30 bg-primary/5" : ""
                        }`}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-2.5">
                            <h3 className={`text-[10px] font-black italic uppercase tracking-[0.2em] ${column.id === "En cours" ? "text-orange-500" :
                                column.id === "Terminé" ? "text-green-600" :
                                    "text-primary/40"
                                }`}>
                                {column.title}
                            </h3>
                            <div className={`flex items-center justify-center px-2 py-0.5 rounded-lg border text-[10px] font-black shadow-sm ${column.id === "En cours" ? "bg-orange-50 border-orange-100 text-orange-600" :
                                column.id === "Terminé" ? "bg-green-50 border-green-100 text-green-600" :
                                    "bg-white border-zinc-200 text-primary"
                                }`}>
                                {feedbacks.filter((f) => f.status === column.id).length}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                        {feedbacks
                            .filter((f) => f.status === column.id)
                            .map((feedback) => (
                                <div
                                    key={feedback.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, feedback.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleCardClick(feedback)}
                                    className={`cursor-grab active:cursor-grabbing transition-opacity ${draggedId === feedback.id ? "opacity-50" : "opacity-100"
                                        }`}
                                >
                                    <FeedbackCard
                                        feedback={feedback}
                                        onStatusChange={onStatusChange}
                                        onDelete={onDelete}
                                    />
                                </div>
                            ))}

                        {feedbacks.filter((f) => f.status === column.id).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-zinc-200 text-zinc-300 italic text-xs">
                                Zone vide
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
