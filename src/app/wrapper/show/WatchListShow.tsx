"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { getToList } from '@/app/api/getToList';

interface Show {
  id: number;
  original_name: string;
  poster_path: string;
}

export default function WatchListMovies() {
  const [shows, setMovies] = useState<Show[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const result = await getToList('WatchListShow');
        
        if (!result?.data) {
          throw new Error("Koleksiyon verileri bulunamadı");
        }
        const entries = Array.isArray(result.data) ? result.data : Object.entries(result.data);
        const processedData = entries.map(entry => {
          if (typeof entry === 'object' && entry !== null) {
            if ('Id' in entry) {
              return entry.Id;
            }
            if (entry[1] && typeof entry[1] === 'object') {
              return entry[1].Id;
            }
          }
          return null;
        }).filter(id => id !== null);

        const showPromises = processedData.map(async (id) => {
          const res = await fetch(`http://localhost:3000/api/movie?path=tv/${id}`);
          if (!res.ok) {
            console.error(`Dizi ID ${id} için veri çekilemedi`);
            return null;
          }
          return res.json();
        });

        const results = await Promise.all(showPromises);       
        const validShows = results.filter(show => 
          show && show.poster_path
        );
        setMovies(validShows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Koleksiyon yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Koleksiyonunuz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          <p className="font-semibold">Hata</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-center">
          <p className="text-lg mb-2">Koleksiyonunuzda henüz film bulunmuyor</p>
          <p className="text-sm text-muted-foreground">Filmleri koleksiyonunuza ekleyerek başlayın</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <div className="flex w-screen p-4">
        {shows.map((show) => (
          <figure key={show.id} className="shrink-0 group">
            <div className="relative w-[180px] h-[250px] pr-4">
              <div className="rounded-md pr">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.original_name}
                  width={180}
                  height={250}
                  className="transition-transform duration-300"
                />
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground grid justify-center">
              <div className="flex justify-center items-center h-full" style={{ width: '180px' }}>
                <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {show.original_name}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
} 