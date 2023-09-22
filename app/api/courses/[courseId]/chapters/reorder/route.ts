import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('action not allowed', { status: 403 });
    }

    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
          courseId: params.courseId,
        },
        data: {
          position: item.position,
        },
      });
    }
    return NextResponse.json('Success', { status: 200 });
  } catch (err) {
    console.log('[reorder]', err);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
