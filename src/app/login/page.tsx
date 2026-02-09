"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <Loader2 className="size-6 animate-spin text-primary" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams?.get("registered");

    //le remember me
    useEffect(() => {
        const savedEmail = localStorage.getItem("feebdack-email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // le remember me
            if (rememberMe) {
                localStorage.setItem("feebdack-email", email);
            } else {
                localStorage.removeItem("feebdack-email");
            }

            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-zinc-900 selection:bg-primary selection:text-white">
            <div className="w-full max-w-[420px] animate-fade-in flex flex-col items-center">
                <Link href="/" className="inline-block transition-opacity hover:opacity-80 duration-300 relative z-10 mb-[-7rem] overflow-hidden max-h-[18rem]">
                    <div className="relative w-84 h-84">
                        <Image src="/assets/logo.png" alt="Feebdack Logo" fill className="object-contain" />
                    </div>
                </Link>

                <Card className="w-full bg-white border-2 border-zinc-100 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden relative z-0">
                    <CardContent className="p-10">
                        {registered && (
                            <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-3 italic">
                                Inscription réussie !
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 bg-zinc-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold transition-all shadow-inner"
                                            placeholder="john.doe@example.com"
                                            autoComplete="username"
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
                                            autoComplete="current-password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 ml-1">
                                    <Checkbox
                                        id="remember-me"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="text-xs font-bold text-zinc-600 cursor-pointer select-none"
                                    >
                                        Se souvenir de moi
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 text-center italic">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {loading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <>
                                        Se Connecter
                                        <ArrowRight className="size-4 ml-4 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                    Pas de compte ?{" "}
                    <Link href="/register" className="text-primary hover:underline underline-offset-8 decoration-2 font-black">
                        Rejoindre
                    </Link>
                </p>
            </div>
        </div>
    );
}
