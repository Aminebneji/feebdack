import { NextResponse } from "next/server";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export function handleError(error: unknown): NextResponse {
    console.error("API Error:", error);

    if (error instanceof AppError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.statusCode }
        );
    }

    return NextResponse.json(
        { error: "Une erreur inattendue s'est produite" },
        { status: 500 }
    );
}

export function unauthorized(message: string = "Unauthorized"): NextResponse {
    return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message: string = "Forbidden"): NextResponse {
    return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message: string = "Bad request"): NextResponse {
    return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message: string = "Not found"): NextResponse {
    return NextResponse.json({ error: message }, { status: 404 });
}
