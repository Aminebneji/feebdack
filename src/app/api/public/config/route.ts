import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, handleError, notFound } from "@/lib/errors";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteKey = searchParams.get("siteKey");

        if (!siteKey) {
            throw badRequest("Missing siteKey");
        }

        const site = await prisma.site.findUnique({
            where: { siteKey },
            select: {
                brandColor: true,
            },
        });

        if (!site) {
            throw notFound("Site not found");
        }

        return NextResponse.json(site);
    } catch (error) {
        return handleError(error);
    }
}
