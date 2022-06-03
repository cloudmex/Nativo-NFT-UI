import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from '@mui/material/Tooltip';
//Importamos metodos de interacción con el smartcontract
import {
  fromWEItoEth,
  getContract,
  getSelectedAccount,
  syncNets,
} from "../utils/blockchain_interaction";

import { useHistory } from "react-router";
import { Tab } from '@headlessui/react'
import { currencys } from "../utils/constraint";
import {
  getNearAccount,
  getNearContract,
  fromYoctoToNear,
  fromNearToYocto,
  ext_call,
  ext_view
} from "../utils/near_interaction";
import Swal from 'sweetalert2';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';

function MisTokens(props) {
  //Hooks para el manejo de estados
  const [pagsale, setpagsale] = React.useState(0);
  const [pagCount, setpagCount] = React.useState("");
  const [chunksale, setchunksale] = React.useState(0);
  const [page, setpage] = React.useState(1);
  const [page2, setpage2] = React.useState(1);
  const [trigger, settrigger] = React.useState(true);
  const [ini, setini] = React.useState(true);
  const [firstID, setFirstID] = React.useState(-1);
  const [lastID, setLastID] = React.useState(-1);
  const [statePage, setStatePage] = React.useState(true)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const [loadMsg, setLoadMsg] = React.useState(true)
  const [loadMsg2, setLoadMsg2] = React.useState(true)
  const [t, i18n] = useTranslation("global")
  const [nfts, setNfts] = useState({
    nfts: [],
    page: parseInt(window.localStorage.getItem("Mypage")),
    tokensPerPage: 3,
    tokensPerPageNear: 6,

    blockchain: localStorage.getItem("blockchain"),
    currency: currencys[parseInt(localStorage.getItem("blockchain"))],
  }); //state de los token nft
  const [modal, setModal] = useState({
    //state para la ventana modal
    show: false,
  });

  const [modalSub, setModalSub] = useState({
    //state para la ventana modal
    show: false,
  });

  const [transferModal, setTransferModal] = useState({
    show: false,
  });

  const [approvalModal, setApprovalModal] = useState({
    show: false,
  });

  const [priceModal, setPriceModal] = useState({
    show: false,
  });
  // const [imgs, setImgs] = useState([]);
  let imgs = [];

  async function handleAcceptOffer(tokenId) {
    let contract = await getNearContract();
    let account = await getNearAccount()
    let payload = {
      account_id: account,
      token_id: tokenId,
    };
    console.log(payload)
    let nft = await contract.nft_token(payload);
    let amount = fromNearToYocto(0.01);
    let price = "1"
    console.log(state)
    let msgData = JSON.stringify({ market_type: "accept_offer", price: price, title: nft.metadata.title, media: nft.metadata.media, creator_id: nft.creator_id, description: nft.metadata.description })
    let payloadApproval = {
      token_id: tokenId,
      account_id: process.env.REACT_APP_CONTRACT_MARKET,
      msg: msgData
    }
    console.log(payloadApproval)
    let acceptOffer = contract.nft_approve(
      payloadApproval,
      300000000000000,
      amount
    )
  }

  async function processCancelOffer(tokenID) {
    let payload = {
      nft_contract_id: process.env.REACT_APP_CONTRACT,
      token_id: tokenID,
    }
    ext_call(process.env.REACT_APP_CONTRACT_MARKET, "delete_offer", payload, 300000000000000, 1)
  }

  const APIURL = process.env.REACT_APP_API_TG

  async function makeATransfer(tokenID) {
    setTransferModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalTransTitle"),
      message: t("MyNFTs.modalTransMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setTransferModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeAApproval(tokenID, title, media, creator, description) {
    setApprovalModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalAppTitle"),
      message: t("MyNFTs.modalAppMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      title: title,
      media: media,
      creator: creator,
      description: description,
      change: setApprovalModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  async function makeChangePrice(tokenID) {
    setPriceModal({
      ...state,
      show: true,
      title: t("MyNFTs.modalPriTitle"),
      message: t("MyNFTs.modalPriMsg"),
      loading: false,
      disabled: false,
      tokenID: tokenID,
      change: setPriceModal,
      buttonName: 'X',
      tokenId: 'hardcoded'
    })
  }

  const handleChangePage = (e, value) => {
    console.log(value)
    setpage(value)
    // setpagsale(parseInt(pagCount.split(",")[value - 1].split("-")[1]))
    // setchunksale(parseInt(pagCount.split(",")[value - 1].split("-")[0]))
    // console.log(parseInt(pagCount.split(",")[value - 1].split("-")[1]))
    // console.log(parseInt(pagCount.split(",")[value - 1].split("-")[0]))
    window.scroll(0, 0)
    settrigger(!trigger)
  }

  const handleBackPage = () => {
    console.log("Back")
    window.scroll(0, 0)
    setStatePage(false)
    settrigger(!trigger)
  }

  const handleForwardPage = () => {
    console.log("Forward")
    window.scroll(0, 0)
    setStatePage(true)
    settrigger(!trigger)
  }


  const [state, setState] = React.useState({
    items: [],
    hasMore: true,
    length: 0
  });

  const [state2, setState2] = React.useState({
    items: [],
    hasMore: true,
    length: 0
  });

  const [index, setIndex] = React.useState(0)


  const fetchMoreData = async () => {
    setpage(page + 1);
    let contract = await getNearContract();
    let account = await getNearAccount();

    let nOffers = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_supply_offers_by_owner_id', { account_id: account })
    if (state.items.length >= (nOffers-1)) {
      console.log("no hay ofertas")
      setState({ ...state, hasMore: false });
      return;
    }
    console.log(nOffers)
    let payload2 = {
      account_id: account,
      from_index: (page * 3).toString(),
      limit: nfts.tokensPerPage
    }
    let data = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_offers_by_owner_id', payload2)
    setState({
      ...state,
      items: state.items.concat(data)
    })
  };

  const fetchMoreData2 = async () => {
    setpage2(page2 + 1);
    let contract = await getNearContract();
    let account = await getNearAccount();

    let nOffersBid = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_supply_offers_by_bidder_id', { account_id: account })
    if (state2.items.length >= (nOffersBid-1)) {
      setState2({...state2, hasMore: false });
      return;
    }
    let payload2Bid = {
      account_id: account,
      from_index: (page2 * 3).toString(),
      limit: nfts.tokensPerPage
    }
    let dataBid = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_offers_by_bidder_id', payload2Bid)
    setState2({
      ...state2,
      items: state2.items.concat(dataBid)
    })
  };


  const history = useHistory();

  let [categories] = useState({
    owned: [],
    received: [],
  })

  // useEffect(() => {
  //   (async () => {
  //     let account = await getNearAccount()

  //   })
  // })

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  //Hook para el manejo de efectos
  useEffect(() => {
    (async () => {
      window.localStorage.setItem("Mypage", 0);



      if (nfts.blockchain == "0") {
        //Comparamos la red en el combo de metamask con la red de aurora
        await syncNets();
        let account = await getSelectedAccount();
        //obtenemos el listado de nfts
        let nftsArr = await getContract()
          .methods.tokensOfPaginav1(account, nfts.tokensPerPage, nfts.page)
          .call();
        let balance = await getContract().methods.balanceOf(account).call();
        //console.log(nftsArr);

        //filtrar tokens
        let copytoks = nftsArr.filter((tok) => tok.price > 0);

        //convertir los precios de wei a eth
        copytoks = copytoks.map((tok) => {
          return { ...tok, price: fromWEItoEth(tok.price) };
        });

        //Actualizamos el estado el componente con una propiedad que almacena los tokens nft
        setNfts({
          ...nfts,
          nfts: copytoks,
          nPages: Math.ceil(balance / nfts.tokensPerPage) + 1,
          owner: account,
        });
      } else {
        let contract = await getNearContract();
        let account = await getNearAccount();
        let nOffers = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_supply_offers_by_owner_id', { account_id: account })
        setState({...state,length: (nOffers-1)})
        console.log(nOffers-1)
        if ((nOffers-1) == 0) {
          console.log('no hay ofertas owner useEffect')
          setLoadMsg(false)
          setState({ ...state, hasMore: false })
        }
        console.log(nOffers)
        let payload2 = {
          account_id: account,
          from_index: "0",
          limit: nfts.tokensPerPage
        }
        let data = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_offers_by_owner_id', payload2)
        console.log(data)
        setState({
          ...state,
          items: state.items.concat(data)
        })

        let nOffersBid = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_supply_offers_by_bidder_id', { account_id: account })
        setState2({...state2,length: (nOffersBid-1)})
        console.log(nOffersBid-1)
        if ((nOffersBid-1) == 0) {
          console.log('no hay ofertas bidder useEffect')
          setLoadMsg2(false)
          setState2({ ...state2, hasMore: false })
        }
        let payload2Bid = {
          account_id: account,
          from_index: "0",
          limit: nfts.tokensPerPage
        }
        let dataBid = await ext_view(process.env.REACT_APP_CONTRACT_MARKET, 'get_offers_by_bidder_id', payload2Bid)
        setState2({
          ...state2,
          items: state2.items.concat(dataBid)
        })

      }


    })();
  }, [trigger]);

  /**
   * Función que cambia a "no disponible" un token nft que esta a la venta siempre que se sea el owner
   * @param tokenId representa el token id del nft a quitar del marketplace
   * @return void
   */

  return (
    <>
      <section className="text-gray-600 body-font  dark:bg-darkgray ">
        <div className="flex flex-col text-center w-full">
          <div className="lg:w-full bg-yellow5 h-[30px] flex my-8 justify-center">
            <h1 className="sm:text-3xl lg:text-6xl font-black title-font  dark:text-white  bg-darkgray m-0 px-10 font-raleway uppercase self-center">
              {t("Offers.title")}
            </h1>
          </div>

        </div>
        <div className="container px-5 pt-5 mx-auto asda">
          <div className="w-full">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab
                  key={'Mis Ofertas'}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-yellow2 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  {t("Offers.tab1")}
                </Tab>
                <Tab
                  key={'Ofertas Recibidas'}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-yellow2 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  {t("Offers.tab2")}
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel
                  key={"owned"}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  {loadMsg ?
                    <InfiniteScroll
                      dataLength={state.length}
                      next={fetchMoreData}
                      hasMore={state.hasMore}
                      loader={<h4 className="dark:text-yellow2">{t("MyNFTs.loading")}</h4>}
                      endMessage={
                        <p style={{ textAlign: "center" }} className="dark:text-yellow2">
                          <b>{t("MyNFTs.youseenit")}</b>
                        </p>
                      }
                    >
                      <ul>
                        {state.items.map((data, i) => {
                          return (<div key={i}>
                            <li
                              key={data.token_id}
                              className="relative rounded-md p-3 hover:bg-gray-100 flex flex-col md:flex-row place-items-center border-b-2"
                            >
                              <div className="w-full md:w-1/2 flex flex-col md:flex-row text-darkgray mb-2">
                                <div className="w-full md:w-1/2 mb-2">
                                  <h1 className="text-base leading-5">
                                    <b>Token ID:</b> {data.token_id}
                                  </h1>
                                  <p className="text-sm"><b>{t("Offers.tab1-bidder")}</b> {data.buyer_id}</p>
                                  <p className="text-sm"><b>{t("Offers.tab1-bid")}</b> {fromYoctoToNear(data.price)} NEAR</p>
                                </div>
                                <div className="md:w-1/2 text-base text-white flex flex-row place-content-center">
                                  <a
                                    href={`/detail/${data.token_id}`}
                                    className="bg-yellow2 p-4 ml-auto rounded-xlarge w-full md:w-1/2 text-center font-medium"
                                  >{t("Offers.detailNFT")}
                                  </a>
                                </div>
                              </div>
                              <div className="text-base text-white w-full md:w-1/2 flex flex-col md:flex-row place-content-center">
                                <button
                                  className="bg-green-500 p-4 rounded-xlarge ml-auto w-full md:w-1/2 font-medium"
                                  onClick={() => {
                                    handleAcceptOffer(data.token_id)
                                  }}
                                >
                                  {t("Offers.acceptBid")}
                                </button>
                              </div>
                            </li>
                          </div>)
                        })}
                      </ul>
                    </InfiniteScroll>
                    :
                    <p>{t("Offers.tab1-msg")}</p>
                  }

                </Tab.Panel>
                <Tab.Panel
                  key={"received"}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  {loadMsg2 ?
                    <InfiniteScroll
                      dataLength={state2.length}
                      next={fetchMoreData2}
                      hasMore={state2.hasMore}
                      loader={<h4 className="dark:text-yellow2">{t("MyNFTs.loading")}</h4>}
                      endMessage={
                        <p style={{ textAlign: "center" }} className="dark:text-yellow2">
                          <b>{t("MyNFTs.youseenit")}</b>
                        </p>
                      }
                    >
                      <ul>
                        {state2.items.map((data, i) => {
                          return (<div key={i}>
                            <li
                              key={data.token_id}
                              className="relative rounded-md p-3 hover:bg-gray-100 flex flex-col md:flex-row place-items-center border-b-2"
                            >
                              <div className="w-full md:w-1/2 flex flex-col md:flex-row text-darkgray mb-2">
                                <div className="md:w-1/2">
                                  <h1 className="text-base leading-5">
                                    <b>Token ID:</b> {data.token_id}
                                  </h1>
                                  <p className="text-sm"><b>{t("Offers.tab2-owner")}</b> {data.owner_id}</p>
                                  <p className="text-sm"><b>{t("Offers.tab1-bid")}</b> {fromYoctoToNear(data.price)} NEAR</p>
                                </div>
                                <div className="md:w-1/2 text-base text-white flex flex-row place-content-center">
                                  <a
                                    href={`/detail/${data.token_id}`}
                                    className="bg-yellow2 p-4 ml-auto rounded-xlarge w-full md:w-1/2 text-center font-medium"
                                  >{t("Offers.detailNFT")}
                                  </a>
                                </div>
                              </div>
                              <div className="text-base text-white w-full md:w-1/2 flex flex-col md:flex-row place-content-center">
                                <button
                                  className="bg-yellow2 p-4 rounded-xlarge ml-auto w-full md:w-1/2 font-medium"
                                  onClick={() => {
                                    processCancelOffer(data.token_id)
                                  }}
                                >
                                  {t("Offers.cancelBid")}
                                </button>
                              </div>
                            </li>
                          </div>)
                        })}
                      </ul>
                    </InfiniteScroll>
                    :
                    <p>{t("Offers.tab2-msg")}</p>
                  }
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </section>
    </>
  );
}

MisTokens.propTypes = {
  theme: PropTypes.string,
};

MisTokens.defaultProps = {
  theme: "yellow",
};

export default MisTokens;
