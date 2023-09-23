'use client';

import AlertDialogModal from '@/components/modals/alert-dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ChapterActionProps {
  disabled: boolean;
  isPublished: boolean;
  courseId: string;
  chapterId: string;
}

const ChapterActions = ({
  disabled,
  isPublished,
  courseId,
  chapterId,
}: ChapterActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted');
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success('Chapter unpublished!');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success('Chapter is published!');
      }
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-3">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <AlertDialogModal onConfirm={onDelete}>
        <Button disabled={isLoading} size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </AlertDialogModal>
    </div>
  );
};

export default ChapterActions;
