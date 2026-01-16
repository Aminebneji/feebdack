import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { siteService } from "@/services/site.service";
import { authService } from "@/services/auth.service";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = await authService.getCurrentUserId();

        await siteService.deleteSite(id, userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleError(error);
    }
}
