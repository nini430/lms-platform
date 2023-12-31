import IconBadge from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const allFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${allFields}`;
  const isCompleted = requiredFields.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner label="Chapter is not published. It won't be visible within the course" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center gap-x-1 transition hover:opacity-75"
            href={`/teacher/courses/${params.courseId}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back To Course setup
          </Link>
        </div>
        <div className="flex items-center justify-between w-full mt-6">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-3xl font-semibold">Chapter Setup</h1>
            <span className="text-sm text-slate-700">
              {' '}
              Complete all required fields ({completionText})
            </span>
          </div>
          <ChapterActions
            disabled={!isCompleted}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
            <div>
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
            </div>
            <div className="flex items-center gap-x-2 mt-4">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
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
  );
};

export default ChapterIdPage;
