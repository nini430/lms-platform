'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});
const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = (await axios.post('/api/course', values)) as any;
      router.push(`/teacher/courses/${response.id}`);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="max-w-5xl mx-auto h-full flex md:justify-center md:items-center">
      <div className="flex flex-col gap-y-2 ">
        <h1 className="text-3xl font-semibold">Name Your Course:</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos; worry, you can
          always change it later.
        </p>
        <Form {...form}>
          <form
            className="space-y-8 mt-4"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g Advanced Web development"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What wil you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button type="button" size="sm" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button disabled={!isValid || isSubmitting} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
