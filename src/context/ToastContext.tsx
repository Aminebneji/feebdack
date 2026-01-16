"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";
import { classname } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    loading: (message: string) => string;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (type !== "loading") {
            setTimeout(() => dismiss(id), 5000);
        }
        return id;
    }, [dismiss]);

    const success = (message: string) => toast(message, "success");
    const error = (message: string) => toast(message, "error");
    const info = (message: string) => toast(message, "info");
    const loading = (message: string) => toast(message, "loading");

    return (
        <ToastContext.Provider value={{ toast, success, error, info, loading, dismiss }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={classname(
                            "pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-full duration-300",
                            toast.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-800",
                            toast.type === "error" && "bg-rose-50 border-rose-200 text-rose-800",
                            toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-800",
                            toast.type === "loading" && "bg-slate-50 border-slate-200 text-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === "success" && <CheckCircle2 className="size-5 text-emerald-500" />}
                            {toast.type === "error" && <AlertCircle className="size-5 text-rose-500" />}
                            {toast.type === "info" && <Info className="size-5 text-blue-500" />}
                            {toast.type === "loading" && <Loader2 className="size-5 text-slate-500 animate-spin" />}
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
