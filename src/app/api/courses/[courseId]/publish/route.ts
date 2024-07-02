import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params

    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    })

    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    })

    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.imgUrl ||
      !course.categoryId ||
      !course.price ||
      !publishedChapters.length
    ) {
      return new NextResponse("Missing required fields.", { status: 400 })
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.log("[PATCH:COURSE_PUBLISH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
