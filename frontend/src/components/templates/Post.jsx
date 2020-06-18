import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

const Post = (props) => {
    const { state } = useContext(UserContext);
    const { _id, title, likes, comments, body, photo, postedBy } = props.post;
    const [comment, setComment] = useState("");

    const clickLike = () => {
        props.like(_id);
    }

    const clickUnlike = () => {
        props.unlike(_id);
    }

    const postComment = () => {
        props.comment(comment, _id);
    }

    const deletePost = () => {
        props.delete_post(_id);
    }

    const deleteComment = (commentId) => {
        props.delete_comment(_id, commentId);
    }

    return (
        <div className="card home-card">
            <h5 className="post-name">
                <Link to={postedBy._id !== state._id ? `/profile/${postedBy._id}` : `/profile` }>{ postedBy.name }</Link> 
                { postedBy._id === state._id && <i 
                                                    className="material-icons right home-delete" 
                                                    title="Delete Post"
                                                    onClick={deletePost}>delete
                                                </i> }
            </h5>
            <div className="card-image">
                <img src={`${photo}`} alt=""/>
            </div>
            <div className="card-content">
                <div className="home-buttons">
                    <i className="material-icons home-favorite">favorite</i>
                    { 
                        likes.includes(state._id)
                        ? <i className="material-icons home-thumb" onClick={clickUnlike}>thumb_down</i>
                        : <i className="material-icons home-thumb" onClick={clickLike}>thumb_up</i>
                    }
                </div>
                <h6>{likes.length} { likes.length <= 1 ? 'like' : 'likes'}</h6>
                <h6>{title}</h6>
                <p>{body}</p>
                {
                    comments.map(comment => {
                        return (
                            <div key={ comment._id }>
                                <h6>
                                    <b>{ comment.postedBy.name} </b> 
                                    { comment.text } 
                                    { comment.postedBy._id === state._id && <i className="material-icons right home-delete" title="Delete Comment" onClick={() => deleteComment(comment._id)}>delete</i> }
                                </h6>
                            </div>
                        );
                    })
                }
                <form onSubmit={(event) => {
                    event.preventDefault();
                    postComment();
                }}>
                    <div className="post-comment-section">
                        <input value={comment} onChange={(event) => setComment(event.target.value)} type="text" placeholder="Add a comment..." />
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default Post;