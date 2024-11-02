"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { addToList } from '@/app/api/addToList';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';

const PopularMovies = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const path = 'movie/popular';
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/movie?path=${path}`);
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
  }, [path]);

  const userAgent = navigator.userAgent;
  
  const OnClicListButtons = async (movieId: string, movieTitle: string, list: string) => {
    try {
      setLoading(true);
      const result = await addToList(movieId, userAgent, list);      
      if (result.success) {
        if (list=='WatchedListMovie'){
          toast({
            title: `${movieTitle}`,
            description: `Film izledim listesine eklendi.`,
            variant: "default",
          });
        }
        else{
          toast({
            title: `${movieTitle}`,
            description: `Film izleme listesine eklendi.`,
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Hata!",
          description: "Film eklenirken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
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
          <p>Popüler Filmler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <div className="flex w-screen p-4">
        {data.results.map((show: any) => (
          <figure key={show.id} className="shrink-0">
            <div className="relative w-[180px] h-[250px] pr-4">
              <div className="rounded-md pr">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  width={180}
                  height={250}
                  className="transition-transform duration-300"
                />
              </div>
            </div>

            <figcaption className="pt-2 text-xs text-muted-foreground grid justify-center">
            <div className="flex justify-center items-center h-full"
              style={{ width: '160px' }}>
                <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {show.title}
                </span>
              </div>
              <div className="flex space-x-4 mt-2 justify-center items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                        className="text-xs bg-gray px-2 py-1  rounded-md"
                        onClick={() => OnClicListButtons(show.id, show.title, 'WatchListMovie')}
                        disabled={loading}
                      >
                        {loading ? '⏳' : '📘'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Listeme Ekle</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                        className="text-xs bg-gray px-2 py-1  rounded-md"
                        onClick={() => OnClicListButtons(show.id, show.title, 'WatchedListMovie')}
                        disabled={loading}
                      >
                        {loading ? '⏳' : '▶️'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>İzledim</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <button className="text-xs bg-gray-200 px-2 py-1 rounded-md">
                        ⭐
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Puanlama (Yakında)</TooltipContent>
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

export default PopularMovies;
