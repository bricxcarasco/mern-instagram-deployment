import React, { useState, useEffect } from 'react';
import Post from '../templates/Post';

const UserFollowingPost = () => {
    const [posts, setPosts] = useState([]);

    const likePost = (postId) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                postId
            })
        })
        .then(response => response.json())
        .then(result => {
            const newPosts = posts.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setPosts(newPosts);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const unlikePost = (postId) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                postId
            })
        })
        .then(response => response.json())
        .then(result => {
            const newPosts = posts.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setPosts(newPosts);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const makeComment = (comment, postId) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                comment,
                postId
            })
        })
        .then(response => response.json())
        .then(result => {
            const newComment = posts.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setPosts(newComment);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const deletePost = (postId) => {
        fetch(`/delete-post/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(response => response.json())
        .then(result => {
            const newPosts = posts.filter(post => {
                return post._id !== result._id;
            });
            setPosts(newPosts);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const deleteComment = (postId, commentId) => {
        // console.log(postId, commentId)
        fetch(`/delete-comment/${postId}/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(response => response.json())
        .then(result => {
            const newPosts = posts.map(post => {
                if (post._id === result._id) {
                    return result;
                } else {
                    return post;
                }
            });
            setPosts(newPosts);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            fetch('/posts/following', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setPosts(data.posts);
            })
            .catch(error => console.log(error));
        }
    }, []);

    return (
        <div className="home">
            { posts.length !== 0 ? 
                posts.map((post, index) => 
                    <Post 
                        key={post._id} 
                        post={post} 
                        like={likePost} 
                        unlike={unlikePost} 
                        comment={makeComment} 
                        delete_post={deletePost} 
                        delete_comment={deleteComment}/> ) 
                : <h2 className="user-profile-loading center-align">No posts yet...</h2> }
        </div>
    );
}
 
export default UserFollowingPost;