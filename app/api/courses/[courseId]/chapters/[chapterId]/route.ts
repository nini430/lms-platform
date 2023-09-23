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
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse('chapter not found', { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMux = await db.muxData.findFirst({
        where: {
          chapterId: chapter.id,
        },
      });
      if (existingMux) {
        await Video.Assets.del(existingMux.assetId);
        await db.muxData.delete({ where: { id: existingMux.id } });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapters.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(deletedChapter);
  } catch (err) {
    console.log('CHAPTER_DELETE', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    if (values.videoUrl) {
      const existingMux = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMux) {
        await Video.Assets.del(existingMux.assetId);
        await db.muxData.delete({ where: { id: existingMux.id } });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: 'public',
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0].id,
        },
      });
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

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(chapter);
  } catch (err) {
    console.log('chapter patch', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
