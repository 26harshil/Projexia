import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content } = await req.json();

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Find the internal user ID based on Clerk ID
        const user = await prisma.users.findUnique({
            where: { clerkid: userId },
        });

        if (!user) {
            return new NextResponse("User not found in database", { status: 404 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: user.userid,
                published: true // auto-publish for now
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("[POSTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("[POSTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
