import Mux from "@mux/mux-node"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const { video: Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
})

export async function PATCH(
  req: Response,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params
    const { isPublished, ...values } = await req.json()

    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const courseOwner = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    })

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 })

    await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { ...values },
    })

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      })

      if (existingMuxData) {
        await Video.assets.delete(existingMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        })
      }

      const assets = await Video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ["public"],
        test: false,
      })

      await db.muxData.create({
        data: {
          chapterId,
          assetId: assets.id,
          playbackId: assets.playback_ids?.[0]?.id,
        },
      })
    }

    return new NextResponse("Success", { status: 200 })
  } catch (error) {
    console.log("[PATCH:CHAPTER_ID]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params

    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    })

    if (!chapter) return new NextResponse("Not found", { status: 404 })

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      })

      if (existingMuxData) {
        await Video.assets.delete(existingMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        })
      }
    }

    await db.chapter.delete({
      where: {
        id: chapterId,
      },
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        id: chapterId,
        isPublished: true,
      },
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      })
    }

    return new NextResponse("Success", { status: 200 })
  } catch (error) {
    console.log("[DELETE:CHAPTER_ID]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
