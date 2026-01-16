import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Code, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 transition-transform group-hover:rotate-12 duration-300">
                            <Image src="/assets/bdicon.png" alt="Feebdack Logo" fill className="object-contain" />
                        </div>
                        <span className="font-black text-2xl tracking-tight text-primary italic">Feebdack</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                            Connexion
                        </Link>
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Commencer
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-48 pb-24 px-6 relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="max-w-5xl mx-auto text-center space-y-10 animate-fade-in">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 text-primary font-black text-[10px] uppercase tracking-[0.2em] border border-primary/10 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Branchez Feebdack à votre site web
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] italic text-zinc-900">
                        Écoutez Vos <br />
                        <span className="text-primary">Utilisateurs.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-bold leading-relaxed lowercase">
                        Feebdack est un outil minimaliste pour collecter et centraliser les feedbacks de vos utilisateurs.
                    </p>

                    <div className="flex items-center justify-center pt-4">
                        <Link href="/register">
                            <Button size="lg" className="h-16 px-12 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                                Créer un compte
                                <ArrowRight className="ml-4 size-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Feedback Widget Preview */}
                    <div className="mt-24 relative mx-auto max-w-5xl p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-zinc-100 rounded-[3rem] border-4 border-white shadow-2xl">
                        <div className="bg-gradient-to-br from-white via-zinc-50 to-primary/5 rounded-[2.5rem] border border-zinc-200 shadow-xl aspect-video flex items-center justify-center overflow-hidden relative">
                            {/* Animated gradient orbs */}
                            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                            <div className="absolute inset-0 bg-[radial-gradient(#164C3A08_1px,transparent_1px)] [background-size:20px_20px]" />

                            {/* Feedback Form Widget */}
                            <div className="relative z-10 bg-white rounded-[1.25rem] shadow-2xl max-w-[320px] w-full scale-90 md:scale-100 overflow-hidden border border-zinc-200">
                                {/* Header */}
                                <div className="p-5 bg-primary text-white flex items-center gap-3">
                                    <div className="relative w-8 h-8">
                                        <Image src="/assets/bdicon.png" alt="Feebdack" fill className="object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold m-0 ml-4">Laissez un feedback</h3>
                                    </div>
                                </div>

                                {/* Form Body */}
                                <div className="p-5 pointer-events-none">
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5">NOM</label>
                                        <input
                                            type="text"
                                            placeholder="Votre nom"
                                            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm outline-none cursor-default"
                                            defaultValue="John Doe"
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5">FONCTIONNALITÉ</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Design, UX/UI, Performance ..."
                                            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm outline-none cursor-default"
                                            defaultValue="Interface utilisateur"
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5">FEEDBACK</label>
                                        <textarea
                                            placeholder="Dites-nous tout..."
                                            rows={4}
                                            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm outline-none resize-none cursor-default"
                                            defaultValue="N'hésite pas à me dire ce que tu penses de Feebdack !"
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg cursor-default" disabled>
                                        Envoyer
                                    </button>
                                </div>
                            </div>

                            {/* Floating Widget Icon */}
                            <div className="absolute bottom-12 right-12 size-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-zinc-50 animate-bounce">
                                <MessageCircle className="text-white size-8" />
                            </div>
                        </div>

                    </div>
                    <p className="text-center text-sm font-black italic text-zinc-400 leading-tight mt-4">Aperçu du widget intégré à un site web</p>
                </div>
            </section>

            {/* Features */}
            <section className="py-32 px-6 bg-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-black italic tracking-tight text-primary">L'installation</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            number="01"
                            icon={<Zap className="size-6 text-primary" />}
                            title="Créez vous un compte"
                            description="Identifiez vous et accédez à votre dashboard."
                        />
                        <FeatureCard
                            number="02"
                            icon={<Code className="size-6 text-primary" />}
                            title="Une Seule Ligne"
                            description="L'intégration prend 10 minutes tout au plus. Un script de votre côté, c'est tout."
                        />
                        <FeatureCard
                            number="03"
                            icon={<Globe className="size-6 text-primary" />}
                            title="Utilisations"
                            description="Gérez tous vos feedbacks depuis un dashboard centralisé envoyé directement depuis votre application."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t-5 border-primary bg-white">
                <div className="max-w-7xl h-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <div className="relative w-6 h-6">
                            <Image src="/assets/bdicon.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="font-black text-lg tracking-tight italic">Feebdack</span>
                    </div>
                    <div className="opacity-40 grayscale group-hover:grayscale-0 transition-all">
                        <span className="font-bold text-lg tracking-tight italic">Développé par {" "}</span>
                        <Link href="https://aminebneji.github.io/ReactCv2k25" target="_blank" className="font-black text-lg italic hover:text-primary transition-colors">Amine</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-10 bg-white border border-zinc-200 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group opacity-60 hover:opacity-100 flex flex-col relative overflow-hidden">
            <div className="absolute top-8 right-10 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors italic">
                {number}
            </div>
            <div className="size-14 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 mb-8 group-hover:scale-110 transition-transform shadow-inner">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 italic text-zinc-900 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm font-bold text-muted-foreground leading-relaxed lowercase">
                {description}
            </p>
        </div>
    )
}
