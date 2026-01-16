import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { handleError, badRequest } from "@/lib/errors";
import { validateEmailDomain, isDisposableEmail } from "@/lib/email-validator";

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

        // Vérifier que le domaine de l'email existe (DNS MX records)
        const isDomainValid = await validateEmailDomain(email);
        if (!isDomainValid) {
            return NextResponse.json(
                { error: "L'adresse email n'est pas valide. Veuillez utiliser une adresse email réelle." },
                { status: 400 }
            );
        }

        // Bloquer les emails jetables/temporaires
        if (isDisposableEmail(email)) {
            return NextResponse.json(
                { error: "Les adresses email temporaires ne sont pas autorisées." },
                { status: 400 }
            );
        }

        // Vérifier l'unicité de l'email
        const isEmailAvailable = await validateEmailUniqueness(email);
        if (!isEmailAvailable) {
            return NextResponse.json(
                { error: "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email." },
                { status: 409 } // 409 Conflict
            );
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
            return NextResponse.json(
                { error: "Cet email est déjà utilisé." },
                { status: 409 }
            );
        }
        return handleError(error);
    }
}
