'use client';

import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Course } from '@prisma/client';

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface TitleFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const router = useRouter();
  const [isEditing, setisEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course updated');
      setisEditing((prev) => !prev);
      router.refresh();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between">
        Course title
        <Button
          onClick={() => setisEditing((current) => !current)}
          variant="ghost"
        >
          {isEditing ? <>Cancel</> : <><Pencil className="w-4 h-4 mr-2" /> Edit Title</>}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-4">{initialData?.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Advanced web development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}>Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TitleForm;
