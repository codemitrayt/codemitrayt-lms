import db from "@/lib/db"

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: publishedChapterIds },
        isCompleted: true,
      },
    })

    const userProgressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100

    return userProgressPercentage
  } catch (error) {
    console.log("[GET_PROGRESS] Error :: ", error)
    return 0
  }
}
