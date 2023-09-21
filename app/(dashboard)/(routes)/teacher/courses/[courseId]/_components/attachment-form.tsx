'use client';

import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Attachment, Course } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { File, Loader2, Pencil, X } from 'lucide-react';
import { Form, useForm } from 'react-hook-form';
import FileUpload from '@/components/file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AttachmentFormProps {
  courseId: string;
  initialData: Course & { attachments: Attachment[] };
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ courseId, initialData }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setisEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { url: '' },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course updated');
      setisEditing((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment removed');
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="p-4 bg-slate-100 rounded-md border mt-4">
      <div className="flex justify-between">
        Course Attachment
        <Button onClick={() => setisEditing((prev) => !prev)} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Add File
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.attachments.length === 0 && (
        <p className="text-sm mt-2 italic text-gray-500">No Attachments</p>
      )}

      {!isEditing && initialData.attachments.length > 0 && (
        <div className="space-y-4">
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="border p-4 flex items-center gap-x-3 border-sky-200 bg-sky-100 rounded-md text-sky-700"
            >
              <File className="w-7 h-7" />
              <p className="line-clamp-1">{attachment.name}</p>
              {deletingId === attachment.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className="ml-auto hover:opacity-75 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <FileUpload
          endpoint="attachmentFiles"
          onChange={(url?: string) => onSubmit({ url: url as string })}
        />
      )}
    </div>
  );
};

export default AttachmentForm;
