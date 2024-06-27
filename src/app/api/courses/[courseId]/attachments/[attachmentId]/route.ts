import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId, attachmentId } = params

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

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
        courseId,
      },
    })

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 400 })
    }

    await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId,
      },
    })

    return NextResponse.json({ message: "Attachment deleted succefully." })
  } catch (error) {
    console.log("[ATTACHMENT]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
