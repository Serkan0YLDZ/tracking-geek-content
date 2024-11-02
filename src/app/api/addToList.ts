"use server";

import { redis } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'

export async function addToList(Id: string, userAgent: string, list: string) {
  const user = await currentUser()
  if (!user) {
    return { success: false };
  }
  const userID = `UserID:${user.id}:${list}`;
  try {
    await redis.xadd(userID, '*', { 'Id': Id, 'device': userAgent });
  } catch (error) {
    return { success: false };
  }
  return { success: true };
}

export async function addToListShow(showId: string, season: string, episode: string,  userAgent: string,) {
  const user = await currentUser()
  if (!user) {
    return { success: false };
  }
  const userID = `UserID:${user.id}:WatchedListShow`;
  try {
    await redis.xadd(userID, '*', { 'Id': showId, 'season': season, 'episode':episode, 'device': userAgent });
  } catch (error) {
    return { success: false };
  }
  return { success: true };
}
