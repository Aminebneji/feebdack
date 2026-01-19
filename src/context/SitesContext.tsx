"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { eventEmitter, EVENTS } from "@/lib/events";

interface Site {
    id: string;
    name: string;
    url: string;
    siteKey: string;
    createdAt: string;
}

interface SitesContextType {
    sites: Site[];
    loading: boolean;
    fetchSites: () => Promise<void>;
    addSite: (site: Site) => void;
    removeSite: (siteId: string) => void;
    deleteSite: (siteId: string) => Promise<boolean>;
    updateSite: (site: Site) => void;
}

const SitesContext = createContext<SitesContextType | undefined>(undefined);

export function SitesProvider({ children }: { children: React.ReactNode }) {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    const fetchSites = useCallback(async () => {
        try {
            const res = await fetch("/api/sites");
            if (res.ok) {
                const data = await res.json();
                setSites(data);
            } else {
                error("Erreur lors de la récupération des sites");
            }
        } catch (err) {
            console.error("Failed to fetch sites:", err);
            error("Une erreur réseau est survenue lors du chargement des sites");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchSites();
    }, [fetchSites]);

    const addSite = useCallback((site: Site) => {
        setSites((prev) => [site, ...prev]);
        eventEmitter.emit(EVENTS.SITE_CHANGED);
    }, []);

    const removeSite = useCallback((siteId: string) => {
        setSites((prev) => prev.filter((s) => s.id !== siteId));
        eventEmitter.emit(EVENTS.SITE_CHANGED);
    }, []);

    const updateSite = useCallback((site: Site) => {
        setSites((prev) => prev.map((s) => (s.id === site.id ? site : s)));
    }, []);

    const deleteSite = useCallback(
        async (siteId: string) => {
            try {
                const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
                if (res.ok) {
                    removeSite(siteId);
                    return true;
                }
                return false;
            } catch (err) {
                console.error("Failed to delete site:", err);
                return false;
            }
        },
        [removeSite]
    );

    return (
        <SitesContext.Provider value={{ sites, loading, fetchSites, addSite, removeSite, deleteSite, updateSite }}>
            {children}
        </SitesContext.Provider>
    );
}

export function useSites() {
    const context = useContext(SitesContext);
    if (!context) {
        throw new Error("useSites must be used within a SitesProvider");
    }
    return context;
}
