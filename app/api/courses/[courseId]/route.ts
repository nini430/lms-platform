import Mux from '@mux/mux-node';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('unauthorized', { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse('course not found', { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });
    return NextResponse.json(deletedCourse, { status: 200 });
  } catch (err) {
    console.log('[COURSE_ID_DELETE]', err);
    return new NextResponse('internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!courseId) {
      return new NextResponse('courseId is required', { status: 400 });
    }
    const values = await req.json();

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: { ...values },
    });

    return NextResponse.json(course, { status: 200 });
  } catch (err) {
    console.log('[COURSE_ID_PATCH]');
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
