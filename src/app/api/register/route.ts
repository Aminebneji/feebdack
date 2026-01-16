import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { handleError, badRequest } from "@/lib/errors";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Valider les données
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return badRequest(validation.error.issues[0].message);
        }

        const { name, email, password } = validation.data;

        // Vérifier si l'utilisateur existe 
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return badRequest("Registration failed. Please try again.");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        return handleError(error);
    }
}
