"use client"

import AlertDialogModal from '@/components/modals/alert-dialog';
import { Button } from '@/components/ui/button';
import useConfettiStore from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface CourseActionsProps {
  disabled: boolean;
  isPublished: boolean;
  courseId: string;
}

const CourseActions = ({
  disabled,
  isPublished,
  courseId,
}: CourseActionsProps) => {
  const confetti=useConfettiStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course Deleted');

      router.refresh();
      router.push('/teacher/courses');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onTogglePublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished!')
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published!')
        confetti.onOpen();

      }

      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onTogglePublish}
        disabled={isLoading || disabled}
        variant="outline"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <AlertDialogModal onConfirm={onDelete}>
        <Button disabled={isLoading}>
          <Trash className="w-5 h-5" />
        </Button>
      </AlertDialogModal>
    </div>
  );
};

export default CourseActions;
