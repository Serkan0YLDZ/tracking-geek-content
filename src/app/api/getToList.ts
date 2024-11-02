"use server";

import { redis } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function getToList(list:string) {
  const user = await currentUser();

  if (!user) {
    return { success: false, data: null };
  }

  const userID = `UserID:${user.id}:${list}`;
  
  try {
    const allEntries = await redis.xrange(userID, '-', '+');
    console.log(allEntries);
    return { data: allEntries };    
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return { success: false, data: null };
  }
} 