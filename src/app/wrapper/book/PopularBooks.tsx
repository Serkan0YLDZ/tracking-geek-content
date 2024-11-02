'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addToList } from '@/app/api/addToList';

const PopularBooks = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const { toast } = useToast()
  const subject = 'fantasy';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/book?subject=${subject}&limit=10`);
        const result = await res.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err) {
        setError('Veri çekme hatası.');
      }
    };
    fetchData();
  }, [subject]);

  const userAgent = navigator.userAgent;
  const OnClicListButtons = async (bookId: string, bookTitle: string, list: string) => {
    try {
      setLoading(true);
      if (list!='ReadingListShow'){
        const result = await addToList(bookId, userAgent, list);
        if (result.success) {
            toast({
              title: `${bookTitle}`,
              description: `Kitap okudum listesine eklendi.`,
              variant: "default",
            });  
        } else {
          toast({
            title: "Hata!",
            description: "Kitap eklenirken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.",
            variant: "destructive",
          });
        }
      }
      else {
        toast({
          title: `${bookTitle}`,
          description: `Kitap izledim listesine eklendi.`,
          variant: "default",
        });
      }      
    } 
    catch (error) {
      toast({
        title: "Hata!",
        description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } 
    finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Kitaplar Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <div className="flex w-screen p-4">
        {data.works.map((book: any) => (
          <figure key={book.key} className="shrink-0">
            <div className="relative w-[180px] h-[250px] pr-4">
              <div className="rounded-md overflow-hidden w-full h-full">
                <Image
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={book.title}
                  width={180}
                  height={250}
                  className="transition-transform duration-300 object-cover"
                />
              </div>
            </div>

            <figcaption className="pt-2 text-xs text-muted-foreground grid justify-center">
              <div className="flex justify-center items-center h-full" style={{ width: '180px' }}>
                <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {book.title}
                </span>
              </div>

              <div className="text-center mt-1 text-xs text-gray-500">
                by {book.authors?.[0]?.name || 'Unknown Author'}
              </div>

              <div className="flex space-x-4 mt-2 justify-center items-center">
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>                      
                      <Button 
                          className="text-xs bg-gray px-2 py-1  rounded-md"
                          onClick={() => OnClicListButtons(book.cover_id, book.title, 'ReadListBook')}
                          disabled={loading}
                      >
                        {loading ? '⏳' : '📚'}
                      </Button>                      
                    </TooltipTrigger>
                    <TooltipContent>Okudum</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <button className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                        🔖
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Okuyorum Olarak İşaretle</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <button className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                        ⭐
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Puanlama (Yakında) </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PopularBooks;