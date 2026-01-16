"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MonitorX, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function MobileRestrictedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/dashboard";
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth >= 1088) {
                router.push(returnUrl);
                return true;
            }
            return false;
        };

        if (!checkSize()) {
            setIsChecking(false);
        }

        const handleResize = () => {
            checkSize();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [router, returnUrl]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-muted-foreground size-4" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="bg-background border border-border p-8 rounded-lg shadow-sm max-w-sm w-full">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mx-auto mb-6 text-foreground">
                    <MonitorX className="size-6" />
                </div>

                <h1 className="text-xl font-bold text-foreground mb-2">
                    Desktop Optimized
                </h1>

                <p className="text-xs text-muted-foreground mb-8 leading-relaxed font-medium uppercase tracking-tight">
                    Le dashboard de Feebdack nécessite un écran plus grand pour un contrôle précis. Veuillez passer à un ordinateur ou un tablette.
                </p>

                <div className="space-y-4">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/50 py-2 px-4 rounded border border-border">
                        Min width: 1088px
                    </div>

                    <Link href="/" className="block">
                        <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest h-10">
                            Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function MobileRestrictedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-muted-foreground size-4" />
            </div>
        }>
            <MobileRestrictedContent />
        </Suspense>
    );
}
