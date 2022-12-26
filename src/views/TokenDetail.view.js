import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { currencys } from "../utils/constraint";
import {
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
} from "../utils/near_interaction";
import back_arrow from "../assets/img/Back_arrow.png";
import arrow_up from "../assets/img/arrow_up.svg";
import arrow_down from "../assets/img/arrow_down.svg";

import like from "../assets/img/me-gusta-relleno-24.svg";
import view from "../assets/img/eye.svg"
import info from "../assets/img/info.svg"

import like_black from "../assets/img/me-gusta-rellenoblack-24.png";
import OfferModal from "../components/offerModal.component";
import AddTokenModal from "../components/addTokenModal.component";
import loadingGif from "../assets/img/loadingGif.gif";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useWalletSelector } from "../utils/walletSelector";
import { providers, utils } from "near-api-js";
import { Button } from "@mui/material";

function TokenDetail(props) {
  const history = useHistory();

  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [state, setstate] = useState();
  const [btn, setbtn] = useState(true);
  const [t, i18n] = useTranslation("global");

  //Esta logeado
  const [stateLogin, setStateLogin] = useState(false);
  const [hasRoyalty, setHasRoyalty] = useState(false);
  const [hasBids, setHasBids] = useState(false);
  const [creator, setCreator] = useState(false);
  const [noCollection, setNoCollection] = useState(false);
  const [loadInfo, setLoadInfo] = useState(false);


  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  //es el parametro de tokenid
  const { data } = useParams();
  //es el historial de busqueda
  //let history = useHistory();
  const APIURL = process.env.REACT_APP_API_TG;
  const handleSignIn = () => {
    modal.show();
  };
  async function getSaleData(tokenID) {
    let extPayload = {
      nft_contract_token: process.env.REACT_APP_CONTRACT + "." + tokenID,
    };
    // let extData = await ext_view(process.env.REACT_APP_CONTRACT_MARKET,"get_sale",extPayload)
    const args_b64 = btoa(JSON.stringify(extPayload));
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const res = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT_MARKET,
      method_name: "get_sale",
      args_base64: args_b64,
      finality: "optimistic",
    });
    let extData = JSON.parse(Buffer.from(res.result).toString());
    return extData;
  }
  async function getBids(tokenID) {
    let extPayload = {
      nft_contract_id: process.env.REACT_APP_CONTRACT,
      token_id: tokenID,
    };
    // let extData = await ext_view(process.env.REACT_APP_CONTRACT_MARKET,"get_offer",extPayload)
    const args_b64 = btoa(JSON.stringify(extPayload));
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const res = await provider.query({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT_MARKET,
      method_name: "get_offer",
      args_base64: args_b64,
      finality: "optimistic",
    });
    let extData = JSON.parse(Buffer.from(res.result).toString());
    return extData;
  }
  React.useEffect(() => {
    (async () => {
      setStateLogin(accountId != null ? true : false);
      let ownerAccount = accountId;

      let totalSupply;

      if (localStorage.getItem("blockchain") == "0") {
      } else {
        let contract = await getNearContract();
        let account = await getNearAccount();
        let tokenId = data;
        let userData;

        const query = `
              query($tokenID: String){
                tokens (where : {id : $tokenID}){
                  id
                  collectionID
                }
              }
            `;
        const client = new ApolloClient({
          uri: APIURL,
          cache: new InMemoryCache(),
        });

        await client
          .query({
            query: gql(query),
            variables: {
              tokenID: tokenId,
            },
          })
          .then((data) => {
            console.log("token Data: ", data.data.tokens);
            if (data.data.tokens.length <= 0) {
              setNoCollection(true);
            } else {
              userData = data.data.tokens;
            }
          })
          .catch((err) => {
            console.log("error: ", err);
          });

        let payload = {
          account_id: account,
          token_id: tokenId,
        };
        let onSale = false;
        let priceData = "";
        let bids = [];
        let bidder = "";
        let bidPrice = "";
        // let nft = await contract.nft_token(payload);
        const nft_payload = btoa(JSON.stringify(payload));
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({
          url: network.nodeUrl,
        });
        const res = await provider.query({
          request_type: "call_function",
          account_id: process.env.REACT_APP_CONTRACT,
          method_name: "nft_token",
          args_base64: nft_payload,
          finality: "optimistic",
        });
        let nft = JSON.parse(Buffer.from(res.result).toString());
        console.log(nft);
        let bidsData = await getBids(tokenId);
        console.log(bidsData);
        if (nft.creator_id == accountId) {
          setCreator(true);
        }
        if (Object.keys(nft.royalty).length != 0) {
          setHasRoyalty(true);
        }
        if (nft.approved_account_ids.length != 0) {
          Object.entries(nft.approved_account_ids).map((approval, i) => {
            if (approval.includes(process.env.REACT_APP_CONTRACT_MARKET)) {
              onSale = true;
            }
          });
        }
        if (onSale) {
          let data = await getSaleData(tokenId);
          priceData = fromYoctoToNear(data.price);
        }
        console.log(bidsData.buyer_id);
        if (bidsData.buyer_id != "null") {
          console.log("Hay oferta :D");
          setHasBids(true);
          bidder = bidsData.buyer_id;
          bidPrice = fromYoctoToNear(bidsData.price);
        }
        setLoadInfo(true);
        setstate({
          ...state,
          tokens: {
            tokenID: nft.token_id,
            sale: onSale,
            price: priceData,
            bidder: bidder,
            bidPrice: bidPrice,
            account: accountId,
            owner: nft.owner_id,
            //chunk: parseInt(toks.token_id/2400),
          },
          jdata: {
            image: nft.metadata.media,
            title: nft.metadata.title,
            description: nft.metadata.description,
            royalty: Object.entries(nft.royalty),
            creator: nft.creator_id,
          },
          owner: nft.owner_id,
          ownerAccount: ownerAccount,
        });
      }
    })();
  }, []);

  return (
    <>
      <section>
        <div name="view" className="w-full h-full py-8 bg-[#F5F5F5]">
          <div name="token">
            <div name="token_view_left" className=" w-1/2 bg-blue-100">
              <div name="bnt_back" className="mt-4 px-8   text-white  ">
                <Button className=" hover:bg-black  " onClick={history.goBack}>
                  <img className="" alt="back_arrow" src={back_arrow}></img>{" "}
                  <a className=" normal-case px-2 my-4 text-[#616161]">
                    {t("MintNFT.cancel")}{" "}
                  </a>
                </Button>
              </div>
              <div
                name="token_card "
                className="h-full flex flex-col justify-center items-center "
              >
                {/* relative  */}
                <div className="w-5/6 text-center bg-white rounded-2xl ">
                  {/* absolute  top-0 bottom-0 left-0 right-0 m-auto  */}
                  <div
                    name="token_card_img"
                    className="w-full   h-[280px]   md:h-[340px] lg:h-[350px]  xl:h-[650px]  overflow-hidden rounded-2xl border-2 border-white drop-shadow-md   bg-[#EBEBEB]"
                  >
                    <img
                      className=" w-full h-full  object-cover object-center "
                      alt="hero"
                      src={null}
                    />
                  </div>

                  <div
                    name="token_card_likeview"
                    className="flex justify-end w-full  rounded-b-lg drop-shadow-2xl h-[60px] py-4  "
                  >
                    <div className="flex flex-row  hover:animate-bounce">
                      {" "}
                      <p name="likes" className="mx-2">
                        {" "}
                        {"0"}
                      </p>
                      <img
                        className=" w-5 h-5 mt-1  object-cover object-center "
                        alt="like"
                        src={like}
                      />
                    </div>

                    <div className="flex flex-row mx-6 hover:animate-bounce">
                      {" "}
                      <p name="views" className="mx-2">
                        {" "}
                        {"0"}
                      </p>
                      <img
                        className=" w-5 h-5 mt-1  object-cover object-center "
                        alt="view"
                        src={view}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                name="token_view_left_info"
                className="mt-5 flex flex-col justify-left items-center  "
              >
                <button
                  className="bg-white  rounded-t-lg w-5/6 h-[60px] drop-shadow-lg flex justify-between "
                  onClick={(e) => {
                    setShowDetailedInfo(!showDetailedInfo);
                  }}
                >
                  <div className=" flex py-4">
                    <img
                      className=" w-5 h-5  object-cover object-center  mx-4"
                      alt="info"
                      src={info}
                    />

                    <p>información</p>
                  </div>

                  <div className="py-4 mx-4 hover:animate-bounce">
                    <img
                      className=" w-5 h-5  object-cover object-center  "
                      alt="arrow_down"
                      src={showDetailedInfo ? arrow_up : arrow_down}
                    />
                  </div>
                </button>
                <hr />
                {showDetailedInfo ? (
                  <div
                    name="info_detailed"
                    className="bg-white w-5/6  h-30   drop-shadow-lg rounded-lg transition-all "
                  >
                    <div name="title" className="w-full  m-4">
                      <div name="collection">
                        <p>MEDUSAS</p>
                      </div>
                      <div name="token_name" className="font-bold text-2xl">
                        <p>M3DUSA N30N 01</p>
                      </div>
                    </div>
                    <div name="details" className="flex  mx-4 mb-2">
                      <div name="info_detailed_left" className="w-2/3">
                        <div name="description" className="font-bold  ">
                          <p>Descripción</p>
                        </div>
                        <div name="description_text">
                          <p>
                            Recuerdos de un entorno virtual en Odaiba, Tokyo
                          </p>
                        </div>
                      </div>
                      <div name="info_detailed_right" className="w-1/3">
                        <div name="detalles" className="font-bold ">
                          <p>Detalles</p>
                        </div>

                        <div name="CA" className=" flex justify-between w-full">
                          <p className="font-bold text-sm tracking-tighter w-2/3 ">Contract Address</p>  <p className=" text-xs tracking-tighter truncate w-1/3">Nativo token dedefedfrfddfdfdfdfdf</p>
                        </div>
                        <div name="TID" className=" flex justify-between">
                          <p className="font-bold text-sm tracking-tighter">Token ID</p>  <p className=" text-xs tracking-tighter">184</p>
                        </div>
                        <div name="TST" className=" flex justify-between">
                          <p className="font-bold text-sm tracking-tighter">Token Standart</p>  <p className=" text-xs tracking-tighter"> NEP-171</p>
                        </div>
                        <div name="CN" className=" flex justify-between">
                          <p className="font-bold text-sm tracking-tighter">Chain</p>  <p className=" text-xs tracking-tighter"> NEAR</p>
                        </div>
                        <div name="LUD" className=" flex justify-between">
                          <p className="font-bold text-sm tracking-tighter">Last Updated</p>  <p className=" text-xs tracking-tighter"> Never</p>
                        </div>
                        <div name="CF" className=" flex justify-between">
                          <p className="font-bold text-sm tracking-tighter">Creator Fee</p>  <p className=" text-xs tracking-tighter"> 5%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div name="token_view_right"></div>
          </div>
          <div name="more_tokens"></div>
        </div>
      </section>
    </>
  );
}

TokenDetail.defaultProps = {
  theme: "yellow",
};

TokenDetail.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default TokenDetail;
