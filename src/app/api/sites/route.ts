import { NextResponse } from "next/server";
import { handleError, badRequest } from "@/lib/errors";
import { siteService } from "@/services/site.service";
import { authService } from "@/services/auth.service";

export async function GET() {
    try {
        const userId = await authService.getCurrentUserId();
        const sites = await siteService.getUserSites(userId);

        return NextResponse.json(sites);
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req: Request) {
    try {
        const userId = await authService.getCurrentUserId();
        const body = await req.json();
        const { name, url } = body;

        const site = await siteService.createSite(userId, { name, url });
        return NextResponse.json(site);
    } catch (error) {
        return handleError(error);
    }
}

export async function PATCH(req: Request) {
    try {
        const userId = await authService.getCurrentUserId();
        const body = await req.json();
        const { id, name, url } = body;

        if (!id) {
            throw badRequest("ID required");
        }

        const updated = await siteService.updateSite(id, userId, { name, url });
        return NextResponse.json(updated);
    } catch (error) {
        return handleError(error);
    }
}
