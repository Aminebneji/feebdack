"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.error || "Une erreur est survenue");
            }
        } catch {
            setError("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-zinc-900 selection:bg-primary selection:text-white">
            <div className="w-full max-w-[440px] animate-fade-in flex flex-col items-center">
                <div className="inline-block transition-opacity hover:opacity-80 duration-300 relative z-10 mb-[-7rem] overflow-hidden max-h-[20rem]">
                    <div className="relative w-96 h-96">
                        <Image src="/assets/logo.png" alt="Feebdack Logo" fill className="object-contain" />
                    </div>
                </div>

                <Card className="w-full bg-white border-2 border-zinc-100 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden relative z-0">
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2.5 relative z-20">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Nom</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-12 h-14 bg-zinc-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all shadow-inner "
                                            placeholder="Amine B."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 bg-zinc-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all shadow-inner z-20"
                                            placeholder="amine@feebdack.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 h-14 bg-zinc-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all shadow-inner"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 text-center italic">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <>
                                        Créer mon compte
                                        <ArrowRight className="size-4 ml-4 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                    Déjà inscrit ?{" "}
                    <Link href="/login" className="text-primary hover:underline underline-offset-8 decoration-2 font-black">
                        S'identifier
                    </Link>
                </p>
            </div>
        </div>
    );
}
