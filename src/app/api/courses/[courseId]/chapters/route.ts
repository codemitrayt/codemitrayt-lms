import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { title } = await req.json()
    const { courseId } = params

    console.log(userId, title, courseId)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    })

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    })

    const position = lastChapter?.position ? lastChapter.position + 1 : 1

    const chapter = await db.chapter.create({
      data: {
        courseId,
        title,
        position,
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.log("[CHAPTERS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
