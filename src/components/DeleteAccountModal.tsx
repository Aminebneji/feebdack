"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export function DeleteAccountModal({ isOpen, onClose, userEmail }: DeleteAccountModalProps) {
    const [emailInput, setEmailInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (emailInput !== userEmail) {
            setError("L'email ne correspond pas");
            return;
        }

        setIsDeleting(true);
        setError("");

        try {
            const response = await fetch("/api/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                await signOut({ callbackUrl: "/" });
            } else {
                const data = await response.json();
                setError(data.error || "Erreur lors de la suppression");
                setIsDeleting(false);
            }
        } catch (err) {
            setError("Erreur de connexion");
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) {
            setEmailInput("");
            setError("");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center text-center space-y-6 py-6">
                    {/* Logo */}
                    <Image
                        src="/assets/logo.png"
                        alt="Feebdack"
                        fill
                        className="opacity-20 blur-xs z-[-2]"
                    />


                    {/* Title */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black italic text-zinc-900">
                            Au revoir
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium">
                            Nous sommes tristes de vous voir partir
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-xl">
                        <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-2">
                            ⚠️ Action irréversible
                        </p>
                        <p className="text-sm text-rose-600">
                            Tous vos sites et feedbacks seront définitivement supprimés.
                        </p>
                    </div>

                    {/* Email Confirmation */}
                    <div className="w-full space-y-3">
                        <div className="text-left">
                            <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                                Confirmez votre email
                            </label>
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder={userEmail}
                                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 focus:border-rose-500 focus:outline-none transition-colors font-medium text-sm"
                                disabled={isDeleting}
                            />
                            {error && (
                                <p className="mt-2 text-xs font-semibold text-rose-600">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={isDeleting}
                            className="flex-1 py-3 px-4 rounded-xl border-2 border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || emailInput !== userEmail}
                            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Suppression..." : "Supprimer mon compte"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
