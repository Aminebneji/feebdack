import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { handleError, badRequest, conflict } from "@/lib/errors";
import { validateEmailDomain, isDisposableEmail, detectEmailTypo } from "@/lib/email-validator";

const validateEmailUniqueness = async (email: string) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
    });
    return !existingUser;
};

const normalizeEmail = (email: string) => {
    return email.toLowerCase().trim();
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Valider les données
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return badRequest(validation.error.issues[0].message);
        }

        const { name, email: rawEmail, password } = validation.data;

        // Normaliser l'email (minuscules, sans espaces)
        const email = normalizeEmail(rawEmail);

        // Vérifier les typos courants (ex: gail.com au lieu de gmail.com)
        const typoCheck = detectEmailTypo(email);
        if (typoCheck.hasTypo) {
            return badRequest(`L'adresse email semble incorrecte. Vouliez-vous dire "${typoCheck.suggestion}" ?`);
        }

        // Vérifier que le domaine de l'email existe (DNS MX records)
        const isDomainValid = await validateEmailDomain(email);
        if (!isDomainValid) {
            return badRequest("L'adresse email n'est pas valide. Veuillez utiliser une adresse email réelle.");
        }

        // Bloquer les emails jetables/temporaires
        if (isDisposableEmail(email)) {
            return badRequest("Les adresses email temporaires ne sont pas autorisées.");
        }

        // Vérifier l'unicité de l'email
        const isEmailAvailable = await validateEmailUniqueness(email);
        if (!isEmailAvailable) {
            return conflict("Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.");
        }

        // Hash password avec un salt fort
        const hashedPassword = await bcrypt.hash(password, 12);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email },
        }, { status: 201 }); // 201 Created
    } catch (error) {
        // Gestion spécifique de l'erreur Prisma pour email unique
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return conflict("Cet email est déjà utilisé.");
        }
        return handleError(error);
    }
}
