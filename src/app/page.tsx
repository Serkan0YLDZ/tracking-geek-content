"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { AppSidebar } from "@/components/app-sidebar"
import { ToastProvider } from "@/components/ui/toast";

import Header from './wrapper/header';
import PopularShows from './wrapper/show/PopularShows'
import PopularMovies from './wrapper/movie/PopularMovies'
import PopularMangas from './wrapper/manga/PopularMangas'
import PopularBooks from './wrapper/book/PopularBooks'

export  default   function Page() {
 
  return (
    <SidebarProvider>
      <ToastProvider>
        <AppSidebar />
        <SidebarInset>
          <ResizablePanelGroup
            direction="vertical"
            className="min-h-[200px] max-w-md rounded-lg border min-w-full md:min-w-[calc(100%)]"
          >  
            <Header/>
            <h2 className="text-lg font-bold p-4">Popüler Diziler</h2>           
            <PopularShows/>
            <h2 className="text-lg font-bold p-4">Popüler Filmler</h2>   
            <PopularMovies/>
            <h2 className="text-lg font-bold p-4">Popüler Kitaplar</h2>           
            <PopularBooks/>
            <h2 className="text-lg font-bold p-4">Popüler Mangalar</h2>           
            <PopularMangas/>
          </ResizablePanelGroup>
        </SidebarInset>
      </ToastProvider>
    </SidebarProvider>
  )
}


