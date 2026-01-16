import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors";
import { feedbackService } from "@/services/feedback.service";
import { authService } from "@/services/auth.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const userId = await authService.getCurrentUserId();

        const updated = await feedbackService.updateFeedbackStatus(id, userId, body.status);
        return NextResponse.json(updated);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = await authService.getCurrentUserId();

        await feedbackService.deleteFeedback(id, userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleError(error);
    }
}
