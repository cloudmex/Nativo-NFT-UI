import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { providers, utils } from "near-api-js";

import back_arrow from "../assets/img/Back_arrow.png";
import upfile from "../assets/img/upfile.png";
import nearicon from "../assets/img/Vectornear.png";
 
import {
  estimateGas,
  fromNearToEth,
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
  storage_byte_cost,
} from "../utils/near_interaction";
import { uploadFileAPI } from "../utils/pinata";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
//import trashIcon from "../assets/img/bin.png";
import { useWalletSelector } from "../utils/walletSelector";
import { Button } from "@mui/material";

import { useHistory } from "react-router";

function LightHeroE(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  //este estado contiene toda la info de el componente
  const [mint, setmint] = React.useState({
    file: undefined,
    blockchain: localStorage.getItem("blockchain"),
    name: undefined,
  });

  const [LToken, setLToken] = React.useState();
  const [type_info, setType_info] = useState({
    title: "",
    description: "",
    collection: 0,
    royalties: {},
  });

  const [colID, setColID] = useState(-1);
  const [colName, setColName] = useState("");

  const [t, i18n] = useTranslation("global");
  const [loading, setLoading] = useState(true);

  const [noCollections, setNoCollections] = useState(false);
  const [collectionData, setCollectionData] = useState([]);

  const [addTokenModal, setAddTokenModal] = useState({
    show: false,
  });
  const [state, setstate] = useState();
  const [near_price, setNear_price] = useState(0.0);
  const [new_token_price, setNew_token_price] = useState(0.0);
  const [terms, setTerms] = useState(false);

  const [hide_create_col, setHide_create_col] = useState(false);
  const [hide_set_price, setHide_set_price] = useState(false);

  const [actualDate, setactualDate] = useState("");

  const [formFields, setFormFields] = useState([]);

  const [img, setImg] = useState();

  const APIURL = process.env.REACT_APP_API_TG;
  //guardara todos los valores del formulario

  const format = (v) => {
    return v < 10 ? "0" + v : v;
  };

  const setHide_create_nft = (e) => {
    setHide_create_col(false);
  };
  const setHide_create_coll = (e) => {
    setHide_create_col(true);
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 98 ~ fetchImage ~ res",
      res
    );
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      console.log("x", img.width, "y", img.height);
      setImg(img);
    };
  };
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
      //getting total nfts

      let payload = {
        account_id: window.localStorage.getItem("logged_account"),
      };
      const args_toks2 = btoa(JSON.stringify(payload));
      const totalTokens = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_supply_for_owner",
        args_base64: args_toks2,
        finality: "optimistic",
      });

      let totalTokensParsed = JSON.parse(
        Buffer.from(totalTokens.result).toString()
      );
      let tokenpos = totalTokensParsed - 1;
      console.log(
        "🪲 ~ file: FinishMint.view.js ~ line 120 ~ tokenpos",
        tokenpos
      );

      let payload_last_token = {
        account_id: window.localStorage.getItem("logged_account"),
        from_index: "" + tokenpos,
        limit: 1,
      };
      const Last_Token = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_tokens_for_owner",
        args_base64: btoa(JSON.stringify(payload_last_token)),
        finality: "optimistic",
      });
      let LastTokenParsed = JSON.parse(
        Buffer.from(Last_Token.result).toString()
      );
      setLToken(LastTokenParsed[0]);
      console.log(
        "🪲 ~ file: FinishMint.view.js ~ line 120 ~ totalTokensParsed",
        LastTokenParsed[0]
      );

      fetchImage(
        `https://nativonft.mypinata.cloud/ipfs/${LastTokenParsed[0]?.metadata?.media}`
      );

      let result = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
      );

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
      )
        .then(function (response) {
          // The response is a Response instance.
          // You parse the data into a useable format using `.json()`
          return response.json();
        })
        .then(function (data) {
          console.log(
            "🪲 ~ file: FinishMint.view.js ~ line 163 ~ .then ~ data",
            data
          );

          setNear_price(data?.near?.usd);
          // `data` is the parsed version of the JSON returned from the above endpoint.
          // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        });

      let urlParams = new URLSearchParams(window.location.search);
      console.log(
        "🪲 ~ file: mintNft.view.js ~ line 375 ~ urlParams",
        urlParams
      );
      let execTrans = urlParams.has("transactionHashes");
      console.log(
        "🪲 ~ file: mintNft.view.js ~ line 377 ~ execTrans",
        execTrans
      );
      if (execTrans) {
        window.location.href = "/mynfts";
      }
      setLoading(false);
      return;
    })();
  }, [props]);

  const set_new_price = (e) => {
    setNew_token_price(e.target.value);
  };

  const SetPrice = async (e) => {
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 191 ~ SetPrice ~ payload",
      accountId
    );

    let contract = await getNearContract();
    let amount = fromNearToYocto(0.01);
    let price = fromNearToYocto(new_token_price);
    let msgData = JSON.stringify({
      market_type: "on_sale",
      price: price,
      title: LToken?.metadata?.title,
      media: LToken?.metadata?.media,
      creator_id: LToken?.creator,
      description: LToken?.metadata?.description,
    });
    let payload = {
      token_id: LToken?.token_id,
      account_id: process.env.REACT_APP_CONTRACT_MARKET,
      msg: msgData,
    };
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 191 ~ SetPrice ~ payload",
      payload
    );

    if (new_token_price <= 0) {
      Swal.fire({
        title: t("Modal.setHighestprice"),
        text: t("Modal.setHighestpriceTxt"),
        icon: "error",
        confirmButtonColor: "#E79211",
      });
      return;
    }

    if (!terms) {
      Swal.fire({
        title: t("Modal.transAlert2"),
        text: t("Modal.transAlert2Txt"),
        icon: "error",
        confirmButtonColor: "#E79211",
      });
      return;
    }

    //we're simulating that the transaction is donde

    window.localStorage.setItem("last_token", LToken?.token_id);

    window.localStorage.setItem("price_setted", true);

    const wallet = await selector.wallet();
    wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: process.env.REACT_APP_CONTRACT,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "nft_approve",
            args: payload,
            gas: 300000000000000,
            deposit: amount,
          },
        },
      ],
      walletCallbackUrl: "/mynfts".toString(),
    });
  };

  const AcceptTerms = () => {
    setTerms(!terms);
  };
const SkipPrice = ()=> {
   
  Swal.fire({
    title: t("Modal.skip_tittle"),
    text: t("Modal.skip_description"),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText:"No",
    confirmButtonText: t("Modal.skip_accept")
  }).then((result) => {
    if (result.isConfirmed) {
     window.location.href="/mynfts";
    }
  })
}
  return (
    <section className="text-gray-600 body-font   bg-[#F1EDF2]   h-screen  ">
      {loading ? (
        <>
          <div className="grid grid-cols-1 gap-4 place-content-center items-center">
            <h1 className="text-5xl font-semibold pt-60 text-center ">
              {t("MintNFT.load")}
            </h1>
            <h1 className="text-5xl font-semibold pt-10 text-center ">
              {t("MintNFT.loadMsg")}
            </h1>
          </div>
        </>
      ) : (
        <>
          {/* {collection ? */}
          <>
            <div className="w-full h-full    md:flex  md:flex-row   ">
              {/* Here goes the info nft  */}
              <div
                name="create"
                className="w-full bg-white md:w-2/5 lg:w-5/12 lg:items-center "
              >
                <div name="cancel" className="mt-4 px-6   text-white  ">
                  <Button className="   " onClick={history.goBack}>
                    <img className="" alt="back_arrow" src={back_arrow}></img>{" "}
                    <a className=" lg:text-lg   xl:text-xl 2xl:text-3xl  px-2 mt-2 text-[#616161]">
                      {t("MintNFT.cancel")}{" "}
                    </a>
                  </Button>
                </div>
                <div className="w-full h-full pb-6 flex flex-col px-6       ">
                  <div className="tab flex flex-row drop-shadow-md ">
                    <button onClick={setHide_create_nft}>
                      <h3 className=" text-black py-2 rounded-md  hover:text-white hover:scale-110 tracking-tighter text-lg 	lg:text-xl   xl:text-2xl   2xl:text-4xl  font-open-sans font-bold ">
                        {" "}
                        {t("MintNFT.congrats")}
                      </h3>
                    </button>
                  </div>

                  <div name="nft" hidden={hide_create_col}>
                    {!hide_set_price ? (
                      <p className="my-4  text-base lg:text-lg  xl:text-xl  2xl:text-3xl text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("MintNFT.congratsYourNft")}
                      </p>
                    ) : (
                      <p className="my-4  text-base lg:text-lg xl:text-xl 2xl:text-3xl text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("Modal.price")}
                      </p>
                    )}

                    {!hide_set_price && (
                      <div className="w-full flex  gap-2">
                        
                          <button
                            className={`w-1/2 relative px-4 py-2 bg-yellow2  rounded-md  text-white   text-center hover:scale-105 tracking-tighter uppercase font-open-sans text-xs lg:text-lg  xl:text-xl 2xl:text-2xl font-bold `}
                            onClick={(e) => {
                              setHide_set_price(!hide_set_price);
                            }}
                          >
                            {t("MintNFT.SetPrice")}
                          </button>
                         

                        
                          <button
                            type="submit"
                            onClick={SkipPrice}
                            className={`w-1/2 relative rounded-md px-4 py-2 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter uppercase font-open-sans text-xs  lg:text-lg xl:text-xl 2xl:text-2xl font-bold `}
                          >
                            {t("MintNFT.Skip")}
                          </button>
                         
                      </div>
                    )}

                    {hide_set_price && (
                      <>
                        <div className="w-full flex gap-2">
                          <div className="w-[40px] h-[40px] bg-center  border-2 rounded-full    justify-center items-center">
                            <img
                              className=" mt-2 m-auto  w-5 h-5 2xl:w-10 2xl:h-10  "
                              alt="near"
                              src={nearicon}
                            />
                          </div>

                          <div className="w-full relative rounded-md   flex  text-center border-2 ">
                            <input
                              type="number"
                              min="0.1"
                              max="100000000000000"
                              step="0.1"
                              className="w-4/6 lg:text-lg xl:text-xl 2xl:text-2xl md:w-1/2 lg:w-4/6  pl-2 h-full"
                              placeholder={new_token_price}
                              onChange={(e) => {
                                set_new_price(e);
                              }}
                            />

                            <label className="w-2/6 md:w-1/2  lg:w-2/6 py-2 text-sm lg:text-lg xl:text-xl 2xl:text-2xl">
                              ≈{" "}
                              {(new_token_price * near_price)
                                .toString()
                                .substring(0, 6)}{" "}
                              USD
                            </label>
                          </div>
                        </div>

                        <div className="mt-3">
                          <input
                            type="checkbox"
                            className=""
                            name="terms"
                            id="terms"
                            value={terms}
                            onChange={AcceptTerms}
                          />{" "}
                          <label className="text-sm lg:text-lg xl:text-2xl 2xl:text-4xl text-darkgray">
                            <a className="hover:underline hover:text-blue">
                              {t("Modal.accept")}
                            </a>
                          </label>
                        </div>

                        <div className="w-full mt-2 relative rounded-md px-4 py-2 text-white  bg-yellow2  text-center hover:scale-105">
                          <button
                            className={`   tracking-tighter uppercase font-open-sans text-xs lg:text-lg xl:text-2xl 2xl:text-4xl font-bold `}
                            onClick={(e) => {
                              SetPrice();
                            }}
                          >
                            {t("MintNFT.SetPrice")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div
                name="nft_detail"
                className={
                  "  px-4 md:px-8  mx-auto   mt-4 md:mt-16    w-full h-full    md:w-3/5  xl:w-3/6	       drop-shadow-md       md:flex-row flex-col  md:justify-center xl:justify-center    "
                }
              >
                <div
                  name="card"
                  className="rounded-md flex flex-col    h-full "
                >
                  {
                    //h-7/12
                    //     md:h-screen lg:h-screen  xl:h-screen
                  }
                  <div className="w-full h-2/5  xl:h-2/5   overflow-hidden rounded-t-md   bg-[#EBEBEB]">
                    <img
                      className="w-full h-full object-cover object-center "
                      alt="hero"
                      src={`https://nativonft.mypinata.cloud/ipfs/${LToken?.metadata?.media}`}
                    />
                  </div>
                  <div
                    name="card_det"
                    className="w-full   rounded-b-md   pt-4 px-4    bg-white  "
                  >
                    <p className=" text-black uppercase text-2xl text-ellipsis    md:text-xl  lg:text-2xl  xl:text-3xl 2xl:text-4xl font-bold font-open-sans">
                      {LToken?.metadata
                        ? LToken?.metadata?.title
                        : t("MintNFT.write_title")}
                    </p>
                    {noCollections && (
                      <p className=" text-black text-xl  md:text-2xl font-open-sans tracking-wide	mt-2 ">
                        {colID === -1
                          ? t("addToken.comboOpc")
                          : collectionData.find(({ id }) => id === colID)
                              ?.title}
                      </p>
                    )}

                    <div className="py-4 flex">
                      <img
                        className=" mt-1 w-5 h-5   "
                        alt="near"
                        src={nearicon}
                      />
                      {new_token_price > 0 ? (
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans uppercase  text-md lg:text-xl  xl:text-xl 2xl:text-3xl ">
                          {" "}
                          {new_token_price} NEAR
                        </p>
                      ) : (
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans uppercase  text-lg lg:text-xl  xl:text-2xl 2xl:text-3xl  ">
                          {" "}
                          {t("MintNFT.PendingPrice")}
                        </p>
                      )}
                    </div>

                    <p className="text-black content-en mt-2 mb-2 font-open-sans text-sm md:text-md lg:text-lg  xl:text-xl  2xl:text-2xl">
                      {t("tokCollection.createdBy") +
                        ": " +
                        window.localStorage.getItem("logged_account")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        </>
      )}
    </section>
  );
}

LightHeroE.defaultProps = {
  theme: "yellow",
};

LightHeroE.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightHeroE;
