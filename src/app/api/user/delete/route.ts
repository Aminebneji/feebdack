import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { authService } from "@/services/auth.service";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    try {
        const userId = await authService.getCurrentUserId();

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleError(error);
    }
}
