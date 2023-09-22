'use client';

import { useState } from 'react';
import * as z from 'zod';
import MuxPlayer from '@mux/mux-player-react'

import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Chapter, MuxData } from '@prisma/client';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ChapterVideoFormProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter & { muxData: MuxData | null };
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  courseId,
  chapterId,
  initialData,
}: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Video uploaded!');
      setIsEditing((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="border rounded-md p-4 bg-slate-100 mt-6">
      <div className="flex items-center justify-between">
        Chapter Video
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Video
            </>
          )}
          {!isEditing && initialData?.videoUrl && (
            <>
              <Pencil className="w-4  h-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      <div className='flex justify-center '>
      {!isEditing && !initialData?.videoUrl && (
        <div className='w-60 h-60 flex justify-center items-center bg-slate-200 rounded-md'>
            <Video className='w-10 h-10'/>
        </div>
      )}
      </div>

      {!isEditing && initialData?.videoUrl && (
        <MuxPlayer playbackId={initialData?.muxData?.playbackId as string}/>
      )}
      
      {isEditing && (
        <FileUpload
          onChange={(url?: string) => onSubmit({ videoUrl: url as string })}
          endpoint="chapterVideo"
        />
      )}
      {isEditing && (
        <span className='text-sm text-muted-foreground'>Video upload can take a couple of minutes. refresh the page if you dont see your video after some time.</span>
      )}
    </div>
  );
};

export default ChapterVideoForm;
