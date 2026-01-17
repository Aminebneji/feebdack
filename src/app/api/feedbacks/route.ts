import { NextResponse } from "next/server";
import { handleError, badRequest } from "@/lib/errors";
import { feedbackService } from "@/services/feedback.service";
import { authService } from "@/services/auth.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { siteKey, name, feature, content } = body;
        const origin = req.headers.get("origin");

        const feedback = await feedbackService.createFeedback(siteKey, { name, feature, content }, origin);
        return NextResponse.json(feedback);
    } catch (error) {
        return handleError(error);
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const siteKey = searchParams.get("siteKey");

        if (!siteKey) {
            throw badRequest("Site key required");
        }

        const userId = await authService.getCurrentUserId();
        const feedbacks = await feedbackService.getFeedbacksBySite(siteKey, userId);

        return NextResponse.json(feedbacks);
    } catch (error) {
        return handleError(error);
    }
}
