import { prisma } from "@/lib/prisma";
import { createSiteSchema, siteNameSchema, urlSchema } from "@/lib/validation";
import { badRequest, conflict, forbidden, notFound } from "@/lib/errors";
import crypto from "crypto";

class SiteService {
    // Valide les données de création d'un site
    private validateSiteData(data: { name: string; url: string }) {
        const validation = createSiteSchema.safeParse(data);
        if (!validation.success) {
            throw badRequest(validation.error.issues[0].message);
        }
        return validation.data;
    }

    // Valide le nom d'un site
    private validateSiteName(name: string) {
        const validation = siteNameSchema.safeParse(name);
        if (!validation.success) {
            throw badRequest(validation.error.issues[0].message);
        }
        return validation.data;
    }

    // Valide l'URL d'un site
    private validateSiteUrl(url: string) {
        const validation = urlSchema.safeParse(url);
        if (!validation.success) {
            throw badRequest(validation.error.issues[0].message);
        }
        return validation.data;
    }

    // Normalise l'URL pour éviter les doublons (lowercase, remove trailing slash)
    private normalizeUrl(url: string): string {
        let normalized = url.trim().toLowerCase();
        // Retire le slash final s'il existe
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized;
    }

    // Vérifie la limite de sites pour un utilisateur
    private async checkSiteLimit(userId: string) {
        const siteCount = await prisma.site.count({ where: { userId } });
        if (siteCount >= 10) {
            throw badRequest("Maximum number of sites reached (10)");
        }
    }

    // Récupère un site et vérifie qu'il existe
    private async getSiteOrThrow(siteId: string) {
        const site = await prisma.site.findUnique({ where: { id: siteId } });
        if (!site) {
            throw notFound("Site not found");
        }
        return site;
    }

    // Vérifie que l'utilisateur est propriétaire du site
    private verifyOwnership(site: { userId: string }, userId: string) {
        if (site.userId !== userId) {
            throw forbidden();
        }
    }

    // Génère une clé de site sécurisée
    private generateSiteKey(): string {
        return `sk_${crypto.randomBytes(16).toString('hex')}`;
    }

    // Récupère tous les sites d'un utilisateur
    async getUserSites(userId: string) {
        const sites = await prisma.site.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return sites;
    }

    // Crée un nouveau site
    async createSite(userId: string, data: { name: string; url: string; brandColor?: string }) {
        const validatedData = this.validateSiteData(data);
        const normalizedUrl = this.normalizeUrl(validatedData.url);

        await this.checkSiteLimit(userId);
        const siteKey = this.generateSiteKey();

        try {
            const site = await prisma.site.create({
                data: {
                    name: validatedData.name,
                    url: normalizedUrl,
                    siteKey,
                    userId,
                    brandColor: data.brandColor
                },
            });

            return site;
        } catch (error: any) {
            // violation de l"unicité du champ url
            if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
                throw conflict("Ce site est déjà enregistré par un autre utilisateur.");
            }
            throw error;
        }
    }

    // Met à jour un site
    async updateSite(siteId: string, userId: string, data: { name?: string; url?: string; brandColor?: string }) {
        const validatedName = data.name ? this.validateSiteName(data.name) : undefined;
        let normalizedUrl = undefined;

        if (data.url) {
            const validatedUrl = this.validateSiteUrl(data.url);
            normalizedUrl = this.normalizeUrl(validatedUrl);
        }

        const site = await this.getSiteOrThrow(siteId);
        this.verifyOwnership(site, userId);

        try {
            const updated = await prisma.site.update({
                where: { id: siteId },
                data: {
                    ...(validatedName && { name: validatedName }),
                    ...(normalizedUrl && { url: normalizedUrl }),
                    ...(data.brandColor && { brandColor: data.brandColor }),
                },
            });

            return updated;
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
                throw conflict("Cette URL est déjà utilisée par un autre site.");
            }
            throw error;
        }
    }

    // Supprime un site
    async deleteSite(siteId: string, userId: string) {
        const site = await this.getSiteOrThrow(siteId);
        this.verifyOwnership(site, userId);

        await prisma.site.delete({ where: { id: siteId } });
    }
}

export const siteService = new SiteService();
