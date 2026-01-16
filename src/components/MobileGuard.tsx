"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MobileGuard() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1088) {
                const encodedReturnUrl = encodeURIComponent(pathname);
                router.push(`/mobile-restricted?returnUrl=${encodedReturnUrl}`);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [router, pathname]);

    return null;
}
