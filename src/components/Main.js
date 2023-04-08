import React, { useState } from "react";
import Identicon from "identicon.js";

const Main = (props) => {
  const { web3, posts, createPost, tipPost } = props;
  const [postContent, setPostContent] = useState("");
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <p>&nbsp;</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createPost(postContent);
            }}
          >
            <div className="form-group mr-sm-2">
              <input
                id="postContent"
                type="text"
                className="form-control"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="what's on your mind?"
                required
              ></input>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Share
            </button>
          </form>
          <p>&nbsp;</p>
          <div className="content mr-auto ml-auto">
            {posts.map((post, key) => {
              return (
                <div className="card">
                  <div className="card-header">
                    <img
                      className="mr-2"
                      width="30"
                      height="30"
                      src={`data:image/png;base64,${new Identicon(
                        post.author,
                        30
                      ).toString()}`}
                    ></img>
                    <small className="text-muted">{post.author}</small>
                  </div>
                  <ul id="postlist" className="list-group list-group-flush">
                    <li className="list-group-item">{post.content}</li>
                    <li className="list-group-item">
                      <small className="float-left mt-1 text-muted">
                        TIPS:{" "}
                        {web3.utils.fromWei(post.tipAmount.toString(), "Ether")}{" "}
                        ETH
                      </small>
                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        name={post.id}
                        onClick={(event) => {
                          let tipAmount = web3.utils.toWei("0.1", "Ether");
                          tipPost(event.target.name, tipAmount);
                        }}
                      >
                        TIP 0.1 ETH
                      </button>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
