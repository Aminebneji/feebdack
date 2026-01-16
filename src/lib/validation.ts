import { z } from "zod";

// Email validation
export const emailSchema = z.string()
    .email("Invalid email format")
    .toLowerCase()
    .trim();

// Password validation -
export const passwordSchema = z.string()
    .min(8, "Le mot de passe doit au moins contenir 8 caracteres")
    .regex(/[A-Z]/, "Le mot de passe doit au moins contenir une lettre majuscule")
    .regex(/[a-z]/, "Le mot de passe doit au moins contenir une lettre minuscule")
    .regex(/[0-9]/, "Le mot de passe doit au moins contenir un chiffre");

// Name validation - max 100 characters, trimmed
export const nameSchema = z.string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom doit contenir au plus 100 caracteres")
    .trim();

// URL validation
export const urlSchema = z.string()
    .url("Invalid URL format")
    .trim();

// Site name validation
export const siteNameSchema = z.string()
    .min(1, "Le nom du site est requis")
    .max(200, "Le nom du site doit contenir au maximum 200 caracteres")
    .trim();

// Feedback validation
export const feedbackContentSchema = z.string()
    .min(1, "Le contenu est requis")
    .max(5000, "Le contenu doit contenir au maximum 5000 caracteres")
    .trim();

export const feedbackFeatureSchema = z.string()
    .min(1, "La fonctionnalité est requise")
    .max(200, "La fonctionnalité doit contenir au maximum 200 caracteres")
    .trim();

export const feedbackStatusSchema = z.enum(["À traiter", "En cours", "Terminé"], {
    message: "Statut invalide"
});

// Registration schema
export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});

// Feedback creation schema
export const createFeedbackSchema = z.object({
    siteKey: z.string().min(1, "La clé du site est requise pour ce feedback"),
    name: nameSchema,
    feature: feedbackFeatureSchema,
    content: feedbackContentSchema,
});

// Site creation schema
export const createSiteSchema = z.object({
    name: siteNameSchema,
    url: urlSchema,
});

// Utility function to sanitize HTML (prevent XSS)
export function sanitizeHtml(input: string): string {
    return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
}
