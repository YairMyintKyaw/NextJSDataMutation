"use client"

import { useOptimistic } from 'react';
import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { togglePostLikeStatus } from "@/lib/action";

function Post({ post, action }) {

  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form action={action.bind(null, post.id)} className={post.isLiked?"liked":""}>
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  console.log(posts);
  
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, updatedPostId)=>{
    
    const updatedPostIndex = prevPosts.findIndex(post=> post.id === updatedPostId);
    
    if(updatedPostIndex === -1){
      return prevPosts;
    }
    const updatedPost = {...prevPosts[updatedPostIndex]};
    
    updatedPost.likes += (updatedPost.isLiked? -1: 1);
    updatedPost.isLiked = !updatedPost.isLiked;
    const updatedPosts = prevPosts.map((post, index) => 
      index === updatedPostIndex ? updatedPost : post
    );
    
    return updatedPosts;
  })
  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function toggleLike (postId, e){    
    updateOptimisticPosts(postId); // Optimistic UI update
    try {
      await togglePostLikeStatus(postId); // Async server update
    } catch (err) {
      // Handle the error if needed, maybe revert the optimistic change
      console.error(err);
    }
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={toggleLike} />
        </li>
      ))}
    </ul>
  );
}
