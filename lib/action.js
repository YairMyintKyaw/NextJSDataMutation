"use server"

import { redirect } from "next/navigation";
import { uploadImage } from "./cloudinary";
import { revalidatePath } from "next/cache";

const { storePost, updatePostLikeStatus } = require("./posts");

export async function createPost(prevData, formData) {
  const title = formData.get('title');
  const image = formData.get('image');
  const content = formData.get('content');
  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required.');
  }

  if (!content || content.trim().length === 0) {
    errors.push('Content is required.');
  }

  if (!image || image.size === 0) {
    errors.push('Image is required.');
  }

  if (errors.length > 0) {
    return { errors };
  }

  const imageUrl = await uploadImage(image);
  storePost({
    imageUrl,
    title,
    content,
    userId: 1
  })

  redirect("/feed")
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath('/', 'layout');

}