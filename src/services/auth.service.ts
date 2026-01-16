import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unauthorized } from "@/lib/errors";

// Gère la récupération de l'utilisateur connecté
class AuthService {
    // Récupère l'ID de l'utilisateur connecté
    async getCurrentUserId(): Promise<string> {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw unauthorized();
        }
        return session.user.id;
    }

    // Récupère l'ID de l'utilisateur connecté ou null
    async getCurrentUserIdOrNull(): Promise<string | null> {
        const session = await getServerSession(authOptions);
        return session?.user?.id ?? null;
    }
}

export const authService = new AuthService();
