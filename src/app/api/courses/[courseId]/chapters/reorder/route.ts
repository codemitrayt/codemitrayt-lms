import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

type ChapterReorderProps = {
  id: string
  position: number
}

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const { list } = (await req.json()) as { list: ChapterReorderProps[] }

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

    list.map(async (item) => {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    })

    return new NextResponse("Success", { status: 200 })
  } catch (error) {
    console.log("[CHAPTER_REORDER]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
