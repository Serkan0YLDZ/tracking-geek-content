"use client"
import { useRouter } from 'next/navigation';

import * as React from "react"
import {
  BookOpen,
  LifeBuoy,
  Popcorn,
  Send,
  Tv,
} from "lucide-react"


import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { ScrollArea } from "@/components/ui/scroll-area"

import { ClerkProvider, SignedOut, SignInButton, useUser } from '@clerk/nextjs' 
import { Button } from "./ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isSignedIn, user } = useUser()
  const data = {
    user: {
      name: user?.firstName || "Unknown",
      email: user?.primaryEmailAddress?.emailAddress || "Unknown",
      avatar: user?.imageUrl || "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Diziler",
        url: "#",
        icon: Tv,
        isActive: true,
        items: [
          {
            title: "Şu an İzlenen Diziler",
            url: "#",
          },
          {
            title: "İzlenecek Diziler",
            url: "#",
          },
          {
            title: "Bitirilen Diziler",
            url: "#",
          },
        ],
      },
      {
        title: "Filmler",
        url: "#",
        icon: Popcorn,
        items: [
          {
            title: "İzlenen Filmler",
            url: "#",
          },
          {
            title: "İzlenecek Filmler",
            url: "#",
          },
        ],
      },
      {
        title: "Manga",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Şuan Okuduklarım",
            url: "#",
          },
          {
            title: "Daha Sonra Okuyacaklarım",
            url: "#",
          },
          {
            title: "Başlamadıklarım",
            url: "#",
          },
        ],
      },
      {
        title: "Kitap",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Şuan Okuduklarım",
            url: "#",
          },
          {
            title: "Daha Sonra Okuyacaklarım",
            url: "#",
          },
          {
            title: "Başlamadıklarım",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Yeni Dizi",
        url: "#",
        icon: Tv,
      },
      {
        name: "Yeni Film",
        url: "#",
        icon: Popcorn,
      },
      {
        name: "Yeni Manga",
        url: "#",
        icon: BookOpen,
      },
      {
        name: "Yeni Kitap",
        url: "#",
        icon: BookOpen,
      },
    ],
  }
  
  if (!isSignedIn) return (
    <Sidebar variant="inset" {...props}>
        <ScrollArea>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="http://localhost:3000/ ">
                  <span role="img" aria-label="geek">😊</span>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs">Site for</span>
                      <span className="truncate font-semibold">Tracking Geek Contents</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="mt-auto ">
          <ClerkProvider {...props}>
            <SignedOut>
              <Button onClick={() => router.push('/sign-in')}>
                <SignInButton children="Giriş Yap" />
              </Button>
            </SignedOut>
          </ClerkProvider>
        </SidebarFooter>     
    </Sidebar>
  )
  
  return (
      <Sidebar variant="inset" {...props}>
          <ScrollArea>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                    <a href="http://localhost:3000/ ">
                      <span role="img" aria-label="geek">😊</span>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-xs">Site for</span>
                        <span className="truncate font-semibold">Tracking Geek Contents</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <NavMain items={data.navMain} />
              <NavProjects projects={data.projects} />
              <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter className="mt-auto">
            <NavUser user={data.user} />
          </SidebarFooter>
      </Sidebar>
  )
}
