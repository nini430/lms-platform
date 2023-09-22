'use client';

import { Chapter } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updatedData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const ChaptersList = ({ items, onReorder, onEdit }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDragEnd=(result:DropResult)=>{
    if(!result.destination) return;

    const items=Array.from(chapters);
    const [reorderedItems]=items.splice(result.source.index,1);
    items.splice(result.destination.index,0,reorderedItems);
    const startIndex=Math.min(result.source.index,result.destination.index);
    const endIndex=Math.max(result.source.index,result.destination.index);
    const updatedChapters=items.slice(startIndex,endIndex+1);
    setChapters(items);
    const bulkUpdateData=updatedChapters.map(chapter=>({
        id:chapter.id,
        position:items.findIndex((item)=>item.id===chapter.id)
    }));
    onReorder(bulkUpdateData);
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div className='flex flex-col space-y-3' {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center p-2 gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-slate-700',
                      chapter.isPublished &&
                        'bg-sky-200 border-sky-200 text-sky-700'
                    )}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <div
                      className="p-3 bg-slate-300  rounded-md transition hover:opacity-75 flex justify-center items-center"
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>
                    <p>{chapter.title}</p>
                    <div className="ml-auto flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          'p-1 rounded-md bg-slate-400',
                          chapter.isPublished && 'bg-sky-200'
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {chapter.isFree && (
                        <Badge className="bg-emerald-200 p-1 rounded-md">
                          Free
                        </Badge>
                      )}
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 transition hover:opacity-75 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;
