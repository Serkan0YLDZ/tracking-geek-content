'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MangaData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  chapters: number;
  status: string;
}

const PopularMangas = () => {
  const [data, setData] = useState<{ data: MangaData[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);        
        const res = await fetch('/api/manga');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }        
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }        
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Veri çekme hatası.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 p-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Mangalar Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
        <div className="flex w-screen p-4">
          {data.data.map((manga: MangaData) => (
            <figure key={manga.mal_id} className="shrink-0">
              <div className="relative w-[180px] h-[250px] pr-4">
                <div className="rounded-md overflow-hidden w-full h-full">
                  <Image
                    src={manga.images.jpg.image_url}
                    alt={manga.title}
                    width={180}
                    height={250}
                    className="transition-transform duration-300 object-cover"
                  />
                </div>
              </div>

              <figcaption className="pt-2 text-xs text-muted-foreground grid justify-center">
                <div className="flex justify-center items-center h-full" style={{ width: '180px' }}>
                  <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                    {manga.title}
                  </span>
                </div>

                <div className="text-center mt-1 text-xs text-gray-500">
                  {manga.score ? `Score: ${manga.score} ⭐` : 'No score yet'}
                </div>

                <div className="text-center mt-1 text-xs text-gray-500">
                  Chapters: {manga.chapters || "Devam Ediyor"}
                </div>

                <div className="flex space-x-4 mt-2 justify-center items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                          🔖
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Okuma Listeme Ekle</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <button className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                          📚
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Okudum</TooltipContent>
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

export default PopularMangas;