import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import SocialNetwork from "../abis/SocialNetwork.json";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState("");
  const [socialNetwork, setSocialNetwork] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  async function loadWeb3() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const networkData = SocialNetwork.networks[networkId];
      if (networkData) {
        const socialNetwork = new web3.eth.Contract(
          SocialNetwork.abi,
          networkData.address
        );
        setSocialNetwork(socialNetwork);
        const postCount = await socialNetwork.methods.postCount().call();
        setPostCount(postCount);
        for (var i = 1; i <= postCount; i++) {
          const post = await socialNetwork.methods.posts(i).call();
          setPosts((prev) => {
            return [...prev, post];
          });
        }
        setPosts((prev) => {
          return prev.sort((a, b) => b.tipAmount - a.tipAmount);
        });
        setLoading(false);
      } else {
        window.alert("Social Network contract not deployed to network");
      }
    }
    // } else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // } else {
    //   console.log(
    //     "Non-Ethereum browser detected. You should consider trying MetaMask!"
    //   );
    // }
  }

  function createPost(content) {
    setLoading(true);
    socialNetwork.methods
      .createPost(content)
      .send({ from: account })
      .on("receipt", (receipt) => {
        setPosts([]);
        loadWeb3();
        console.log(receipt);
      });
  }

  function tipPost(id, tipAmount) {
    setLoading(true);
    socialNetwork.methods
      .tipPost(id)
      .send({ from: account, value: tipAmount })
      .on("receipt", (receipt) => {
        setPosts([]);
        loadWeb3();
        console.log(receipt);
      });
  }

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          Loading....
        </div>
      ) : (
        <Main
          web3={web3}
          posts={posts}
          createPost={createPost}
          tipPost={tipPost}
        />
      )}
    </div>
  );
};

export default App;
