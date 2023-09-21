import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

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
