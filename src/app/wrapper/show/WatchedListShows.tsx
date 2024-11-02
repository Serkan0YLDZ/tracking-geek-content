"use client";

import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from "next/image";
import { getToList } from '@/app/api/getToList';

interface Show {
  id: number;
  title: string; 
  poster_path: string;
  season: number;
  episode: number;
}

export default function WatchedListShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const result = await getToList('WatchedListShow');
        if (!result?.data) {
          throw new Error("Koleksiyon verileri bulunamadı");
        }
        const entries = Array.isArray(result.data) ? result.data : Object.entries(result.data);
        const showData = entries.map(entry => {
          const entryData = entry[1];
          return entryData?.Id && entryData.season && entryData.episode
            ? {
                Id: entryData.Id,
                season: entryData.season,
                episode: entryData.episode,
              }
            : null;
        }).filter(item => item !== null) as { Id: number; season: number; episode: number }[];

        const showPromises = showData.map(async ({ Id, season, episode }) => {
          const res = await fetch(`http://localhost:3000/api/movie?path=tv/${Id}`);
          if (!res.ok) {
            console.error(`Dizi ID ${Id} için veri çekilemedi`);
            return null;
          }
          const showDetails = await res.json();
          return {
            id: Id,
            title: showDetails.original_name, 
            poster_path: showDetails.poster_path,
            season,
            episode,
          };
        });

        const results = await Promise.all(showPromises);
        const validShows = results.filter((show): show is Show =>
          show !== null && show.poster_path && show.title
        );
        setShows(validShows);
      } 
      catch (err) {
        setError(err instanceof Error ? err.message : 'Koleksiyon yüklenirken bir hata oluştu');
      }
       finally {
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
          <p className="text-lg mb-2">Koleksiyonunuzda henüz dizi bulunmuyor</p>
          <p className="text-sm text-muted-foreground">Dizileri koleksiyonunuza ekleyerek başlayın</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="whitespace-nowrap rounded-md border">
      <div className="flex w-screen p-4">
        {shows.map((show) => (
          <figure key={show.id} className="shrink-0 group p-2">
            <div className="relative w-[180px] h-[250px] pr-4">
              <div className="rounded-md">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.title}
                  width={180}
                  height={250}
                  className="transition-transform duration-300"
                />
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground grid justify-center">
              <div className="flex flex-col justify-center items-center h-full" style={{ width: '180px' }}>
                <span className="font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                  {show.title} 
                </span>
                <p>Sezon: {show.season}, Bölüm: {show.episode}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
