"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import * as React from "react";

import Header from '@/app/wrapper/header'; 
import WatchListMovies from '@/app/wrapper/movie/WatchListMovies'
import WatchedListMovies from '@/app/wrapper/movie/WatchedListMovies'
import WatchedListShows from '@/app/wrapper/show/WatchedListShows'
import WatchListShow from "@/app/wrapper/show/WatchListShow";

export  default   function Page() {
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[200px] max-w-md rounded-lg border min-w-full md:min-w-[calc(100%)]"
      >
          <Header/>
          <h2 className="text-lg font-bold p-4">Film İzleme Listesi</h2>   
          <WatchListMovies/>
          <h2 className="text-lg font-bold p-4">İzlediğiniz Filmler Listesi</h2>   
          <WatchedListMovies/>        
          <h2 className="text-lg font-bold p-4">Dizi İzleme Listesi</h2>   
          <WatchListShow/>
          <h2 className="text-lg font-bold p-4 ">İzlediğiniz Diziler Listesi</h2>           
          <WatchedListShows/>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}
function redisset() {
  throw new Error("Hata!");
}

