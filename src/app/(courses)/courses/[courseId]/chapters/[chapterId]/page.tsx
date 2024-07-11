import { Banner } from "@/components/ui/banner"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import Preview from "@/components/preview"

import getChapter from "actions/get-chapter"
import VideoPlayer from "../_components/video-player"
import CourseEnrollButton from "../_components/course-enroll-button"
import { File } from "lucide-react"

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth()
  if (!userId) return redirect("/")

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({ userId, ...params })

  if (!course || !chapter) {
    return redirect("/")
  }

  const isLocked = !chapter.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chaperId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <div className="">Add Purchase button</div>
            ) : (
              <CourseEnrollButton
                courseId={params.chapterId}
                price={course.price!}
              />
            )}
          </div>
        </div>

        <Separator />
        <Preview value={chapter.description!} />
        {!!attachments.length && (
          <>
            <Separator />
            {attachments.map((attachment) => (
              <a
                key={attachment.id}
                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                href={attachment.url}
                target="_"
              >
                <File />
                <p className="line-clamp-1">{attachment.name}</p>
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default ChapterIdPage
