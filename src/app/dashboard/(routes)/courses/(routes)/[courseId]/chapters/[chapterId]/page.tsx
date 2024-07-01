import BackButton from "@/components/back-button"
import IconBadge from "@/components/ui/icon-badge"
import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Eye, LayoutDashboard, Video } from "lucide-react"
import { redirect } from "next/navigation"
import ChapterTitleForm from "../_components/chapter-title-form"
import ChapterDescriptionForm from "../_components/chapter-description-form"
import ChapterAccessForm from "../_components/chapter-access-form"
import ChapterVideoForm from "../_components/chapter-video-form"
import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import ChapterActions from "../_components/chapter-actions"

type ChapterIdPageProps = {
  params: { courseId: string; chapterId: string }
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const { userId } = auth()
  if (!userId) return redirect("/")

  const chapter = await db.chapter.findUnique({
    where: { id: params.chapterId, courseId: params.courseId },
    include: {
      muxData: true,
    },
  })

  if (!chapter) return redirect("/")

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`
  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          label="This chapter is unpublished. It will not be visible in the course."
          variant="warning"
        />
      )}
      <div className="flex flex-col p-6">
        <div className="relative">
          <BackButton title="Back to course setup" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2 mt-6">
            <h1 className="text-2xl font-medium">Chapter Setup</h1>
            <span className="text-sm text-muted-foreground">
              Completed all fields {completionText}
            </span>
          </div>

          <ChapterActions
            disabled={!isComplete}
            isPublished={chapter.isPublished}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h1 className="text-lg font-medium">
                Customize your course chapter
              </h1>
            </div>

            <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />

            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />

            <div className="flex items-center gap-x-2 mt-6">
              <IconBadge icon={Eye} />
              <h1 className="text-lg font-medium">Chapter access settings</h1>
            </div>

            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2 mt-6">
              <IconBadge icon={Video} />
              <h1 className="text-lg font-medium">Chapter Video</h1>
            </div>
            <ChapterVideoForm
              courseId={params.courseId}
              chapterId={params.chapterId}
              initialData={chapter}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
