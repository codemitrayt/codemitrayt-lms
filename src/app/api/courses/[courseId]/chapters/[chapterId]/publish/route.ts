import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params

    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    })

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    })

    const muxData = await db.muxData.findUnique({
      where: { chapterId },
    })

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields.", { status: 400 })
    }

    const updatedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    })

    return NextResponse.json(updatedChapter)
  } catch (error) {
    console.log("[PATCH:CHAPTER_PUBLISH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
