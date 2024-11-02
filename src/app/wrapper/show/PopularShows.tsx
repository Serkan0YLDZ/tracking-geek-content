'use client'; 

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { addToList, addToListShow } from '@/app/api/addToList';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';



const PopularShows = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const { toast } = useToast()
  const path = 'tv/popular'; 

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
  const OnClicListButtons = async (Id: string, showTitle: string, list: string) => {
    try {
      setLoading(true);
      if (list!='WatchedListShow'){
        const result = await addToList(Id, userAgent, list);
        if (result.success) {          
            toast({
              title: `${showTitle}`,
              description: `Dizi izleme listesine eklendi.`,
              variant: "default",
            });  
        } else {
          toast({
            title: "Hata!",
            description: "Dizi eklenirken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.",
            variant: "destructive",
          });
        }
      }
      else {
        toast({
          title: `${showTitle}`,
          description: `Dizi izledim listesine eklendi.`,
          variant: "default",
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
          <p>Popüler Diziler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border ">
      <div className="flex w-screen  p-4 ">
        {data.results.map((show: any) => (
          <figure key={show.id} className="shrink-0">
            <div className="relative w-[180px] h-[250px] pr-4">
              <div className=" rounded-md ">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  width={180}
                  height={250}
                  className="transition-transform duration-300"
                />
              </div>
            </div>
            <figcaption className=" pt-2 text-xs text-muted-foreground grid  justify-center ">
              <div className="flex justify-center items-center h-full"
              style={{ width: '160px' }}>
                <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {show.name}
                </span>
              </div>
              <div className="flex  space-x-4 mt-2 justify-center items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                        className="text-xs bg-gray px-2 py-1  rounded-md"
                        onClick={() => OnClicListButtons(show.id, show.name, 'WatchListShow')}
                        disabled={loading}
                      >
                        {loading ? '⏳' : '📘'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Listeme Ekle</TooltipContent>
                  </Tooltip>            

                  <Tooltip>
                    <TooltipTrigger>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                          className="text-xs bg-gray px-2 py-1  rounded-md"
                          disabled={loading}
                          >
                            {loading ? '⏳' : '▶️'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Dizide Nerede Kalmıştınız?  </AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="grid grid-cols-3 items-center gap-4 pr-20 pl-8 pt-3">
                                  <Label htmlFor="season"  className="text-xl font-bold">Sezon</Label>
                                  <Input
                                    id="season"
                                    placeholder="Hangi Sezonda Kaldınız?"
                                    className="col-span-2 h-8"
                                  />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4 pr-20 pl-8 pt-6">
                                  <Label htmlFor="episode" className="text-xl font-bold">Bölüm</Label>
                                  <Input
                                    id="episode"
                                    placeholder="Hangi Bölümde Kaldınız?"
                                    className="col-span-2 h-8"
                                  />
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="w-full text-center font-bold p-2 ">
                              İptal
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              className="w-full text-center font-bold p-2  "
                              onClick={async () => {
                                const seasonInput = document.getElementById('season') as HTMLInputElement;
                                const episodeInput = document.getElementById('episode') as HTMLInputElement;
                                const userAgent = navigator.userAgent;

                                if (seasonInput && episodeInput) {
                                  const result = await addToListShow(show.id, seasonInput.value, episodeInput.value, userAgent);
                                  OnClicListButtons(show.id, show.name, 'WatchedListShow');                                                             
                                } else {
                                  console.error('Unable to get input values');
                                }
                              }}
                            >
                              Kaydet
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

export default PopularShows;
