import { prisma } from "@/lib/prisma";
import { createFeedbackSchema, feedbackStatusSchema } from "@/lib/validation";
import { badRequest, notFound, unauthorized } from "@/lib/errors";

class FeedbackService {
    // Valide les données de création d'un feedback
    private validateFeedbackData(siteKey: string, data: { name: string; feature: string; content: string }) {
        const validation = createFeedbackSchema.safeParse({ siteKey, ...data });
        if (!validation.success) {
            throw badRequest(validation.error.issues[0].message);
        }
        return validation.data;
    }

    // Valide le statut d'un feedback
    private validateFeedbackStatus(status: unknown) {
        const validation = feedbackStatusSchema.safeParse(status);
        if (!validation.success) {
            throw badRequest("Statut invalide");
        }
        return validation.data;
    }

    // Récupère un site par sa clé et vérifie qu'il existe
    private async getSiteBySiteKeyOrThrow(siteKey: string) {
        const site = await prisma.site.findUnique({
            where: { siteKey },
            include: { user: true }
        });
        if (!site) {
            throw notFound("Site not found");
        }
        return site;
    }

    // Récupère un feedback avec son site et vérifie qu'il existe
    private async getFeedbackWithSiteOrThrow(feedbackId: string) {
        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: { site: true },
        });
        if (!feedback) {
            throw notFound("Feedback not found");
        }
        return feedback;
    }

    // Vérifie que l'utilisateur est propriétaire du site
    private verifyOwnership(site: { userId: string }, userId: string) {
        if (site.userId !== userId) {
            throw unauthorized();
        }
    }

    // Vérifie que l'origine de la requête correspond à l'URL du site
    private verifyOrigin(siteUrl: string, origin: string | null) {
        if (!origin) {
            throw unauthorized("Origin header missing");
        }

        try {
            // On extrait le hostname pour comparer (ex: localhost, example.com)
            // L'URL du site est validée comme une URL complète par zod
            const siteHostname = new URL(siteUrl).hostname;
            const originHostname = new URL(origin).hostname;

            if (siteHostname !== originHostname) {
                throw unauthorized(`Unauthorized origin: ${originHostname}`);
            }
        } catch (error) {
            throw badRequest("Invalid URL or Origin header");
        }
    }

    // Crée un nouveau feedback
    async createFeedback(siteKey: string, data: { name: string; feature: string; content: string }, origin: string | null) {
        this.validateFeedbackData(siteKey, data);
        const site = await this.getSiteBySiteKeyOrThrow(siteKey);

        // Vérification de l'origine pour éviter le feedback spoofing
        this.verifyOrigin(site.url, origin);

        const feedback = await prisma.feedback.create({
            data: {
                siteId: site.id,
                name: data.name,
                feature: data.feature,
                content: data.content,
                status: "À traiter"
            },
        });

        return feedback;
    }

    // Récupère tous les feedbacks d'un site
    async getFeedbacksBySite(siteKey: string, userId: string) {
        const site = await this.getSiteBySiteKeyOrThrow(siteKey);
        this.verifyOwnership(site, userId);

        const feedbacks = await prisma.feedback.findMany({
            where: { siteId: site.id },
            orderBy: { createdAt: "desc" },
        });

        return feedbacks;
    }

    // Met à jour le statut d'un feedback
    async updateFeedbackStatus(feedbackId: string, userId: string, status: unknown) {
        const validatedStatus = this.validateFeedbackStatus(status);
        const feedback = await this.getFeedbackWithSiteOrThrow(feedbackId);
        this.verifyOwnership(feedback.site, userId);

        const updated = await prisma.feedback.update({
            where: { id: feedbackId },
            data: { status: validatedStatus },
        });

        return updated;
    }

    // Supprime un feedback
    async deleteFeedback(feedbackId: string, userId: string) {
        const feedback = await this.getFeedbackWithSiteOrThrow(feedbackId);
        this.verifyOwnership(feedback.site, userId);

        await prisma.feedback.delete({ where: { id: feedbackId } });
    }
}

export const feedbackService = new FeedbackService();
