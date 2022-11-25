/* global BigInt */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2'
//importamos metodos para interactuar con el smart contract, la red de aurora y el account

import { getNearContract, fromNearToYocto, ext_call, getNearAccount } from "../utils/near_interaction";
import { useTranslation } from "react-i18next";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useWalletSelector } from "../utils/walletSelector";
//impimport nearicon from "../assets/img/Vectornear.png";
import nearicon from "../assets/img/Vectornear.png";

export default function Set_token_detailModal(props ) {
  //const history = useHistory();
  const { selector, modalWallet, accounts, accountId } = useWalletSelector();
  const [state, setState] = useState({ disabled: false });
  const [t, i18n] = useTranslation("global")
  const [highestbidder, setHighestbidder] = useState(0);
  const APIURL = process.env.REACT_APP_API_TG
  const [noCollections, setNoCollections] = useState(false)
  const [collectionData, setCollectionData] = useState([])
   const [new_token_price, setNew_token_price] = useState(0.0);
  const [terms, setTerms] = useState(false);
  const [colID, setColID] = useState(-1);
  const [colName, setColName] = useState("");
  const [addTokenModal, setAddTokenModal] = useState({
    show: false,
  });

  const [LToken, setLToken] = React.useState();

  const [hide_create_col, setHide_create_col] = useState(false);
  const [hide_set_price, setHide_set_price] = useState(false);
  const [hide_set_col, setHide_set_col] = useState(false);
  const [hide_set_save, setHide_set_save] = useState(false);
  const [hide_set_modal, setHide_set_modal] = useState(false);
  const [near_price, setNear_price] = useState(0.0);

  const set_new_price = (e) => {
    setNew_token_price(e.target.value);
  };


  const AcceptTerms = () => {
    setTerms(!terms);
  };


  const SetPrice = async (e) => {
    //heres start the batch transaction
    const transactions = [];
    //validate form
    let contract = await getNearContract();
    let amount = fromNearToYocto(0.01);
    if (hide_set_price && new_token_price > 0) {
  
      let price = fromNearToYocto(new_token_price);
      let msgData = JSON.stringify({
        market_type: "on_sale",
        price: price,
        title: LToken?.metadata?.title,
        media: LToken?.metadata?.media,
        creator_id: LToken?.creator,
        description: LToken?.metadata?.description,
      });
      let payload_price = {
        token_id: LToken?.token_id,
        account_id: process.env.REACT_APP_CONTRACT_MARKET,
        msg: msgData,
      };
      transactions.push({
        signerId: accountId,
        receiverId: process.env.REACT_APP_CONTRACT,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_approve",
              args: payload_price,
              gas: 300000000000000,
              deposit: amount,
            },
          },
        ],
        walletCallbackUrl: "/mynfts".toString(),
      });
    } 
    if(hide_set_price && new_token_price <= 0) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: t("MintNFT.alertPrice"),
        showConfirmButton: false,
        timer: 2000,
      });


     
    }

    if (hide_set_col &&  colID>= 0) {
      
      let Col_payload = {
        contract_id: process.env.REACT_APP_CONTRACT,
        title: LToken?.metadata?.title,
        description: LToken?.metadata?.description,
        media: LToken?.metadata?.media,
        collection_id: colID,
      };

      transactions.push({
        signerId: accountId,
        receiverId: process.env.REACT_APP_CONTRACT_MARKET,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "add_token_to_collection_xcc",
              args: Col_payload,
              gas: 300000000000000,
              deposit: 0,
            },
          },
        ],
      });
    } 
    if(hide_set_col && colID< 0) {Swal.fire({
      position: "top-center",
      icon: "warning",
      title: t("MintNFT.alertCol"),
      showConfirmButton: false,
      timer: 2000,
    });
    return;
     
    }
    console.log(
      "🪲 ~ file: FinishMint.view.js ~ line 323 ~ SetPrice ~ transactions",
      transactions
    );
   
    //we're simulating that the transaction is donde
    window.localStorage.setItem("last_token", LToken?.token_id);
    window.localStorage.setItem("price_setted", true);

    const wallet = await selector.wallet();

    return wallet.signAndSendTransactions({ transactions }).catch((err) => {
      alert("Failed to add messages exception " + err);
      console.log("Failed to add messages");

      throw err;
    });
  };

  const SkipPrice = () => {
    Swal.fire({
      title: t("Modal.skip_tittle"),
      text: t("Modal.skip_description"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: t("Modal.skip_accept"),
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/mynfts";
      }
    });
  };
  useEffect(() => {
    (async () => {

      let userData;

      let account = accountId;
      const query = `
          query($account: String){
            collections (where : {owner_id : $account}){
              id
              title
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
            account: account,
          },
        })
        .then((data) => {
          console.log(
            "🪲 ~ file: Mint.view.js ~ line 525 ~ .then ~ data",
            data
          );
          console.log("collections: ", data.data.collections);
          if (data.data.collections.length <= 0) {
            setNoCollections(false);
          } else {
            userData = data.data.collections;
            setCollectionData(userData);
            setNoCollections(true);
          }
        })
        .catch((err) => {
          console.log("error: ", err);
        });
       // if (props.show) {
      //   console.log(props)
      //   let userData
      //   let account = accountId
      //   const query = `
      //     query($account: String){
      //       collections (where : {owner_id : $account}){
      //         id
      //         title
      //       }
      //     }
      //   `
      //   const client = new ApolloClient({
      //     uri: APIURL,
      //     cache: new InMemoryCache(),
      //   })

      //   await client.query({
      //     query: gql(query),
      //     variables: {
      //       account: account
      //     }
      //   })
      //     .then((data) => {
      //       console.log('collections: ', data.data.collections)
      //       if (data.data.collections.length <= 0) {
      //         setNoCollections(false)
      //       }
      //       else {
      //         userData = data.data.collections
      //         setCollectionData(userData)
      //         setNoCollections(true)
      //       }
      //     })
      //     .catch((err) => {
      //       console.log('error: ', err)
      //     })
      // }
    })()
  }, []);

  // async function handleAddToken() {
  //   console.log("Hola este es el handle")
  //   console.log(colID)
  //   if (colID <= -1) {
  //     Swal.fire({
  //       title: t('addToken.alert1-title'),
  //       text: t('addToken.alert1-msg'),
  //       icon: 'error',
  //       confirmButtonColor: '#E79211'
  //     })
  //     return
  //   }
  //   Swal.fire({
  //     title: t('addToken.alert2-title'),
  //     text: t('addToken.alert2-msg'),
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#E79211',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: "Agregar NFT"
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       console.log("Agregando NFT a una coleccion")
  //       let payload = {
  //         contract_id: process.env.REACT_APP_CONTRACT,
  //         owner_id: props.tokens.owner,
  //         token_id: props.tokens.tokenID,
  //         title: props.jdata.title,
  //         description: props.jdata.description,
  //         media: props.jdata.image,
  //         creator: props.jdata.creator,
  //         price: 10,
  //         collection_id: parseInt(colID)
  //       }
  //       console.log(payload)
  //       // ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_token_to_collection', payload, 300000000000000, 1)
  //       const wallet = await selector.wallet();
  //       wallet.signAndSendTransaction({
  //         signerId: accountId,
  //         receiverId: process.env.REACT_APP_CONTRACT_MARKET,
  //         actions: [
  //           {
  //             type: "FunctionCall",
  //             params: {
  //               methodName: "add_token_to_collection",
  //               args: payload,
  //               gas: 300000000000000,
  //               deposit: 1,
  //             }
  //           }
  //         ]
  //       })
  //     }
  //   })
  // }
  // //Configuramos el formulario para ofertar por un token
  // const formik = useFormik({
  //   initialValues: {
  //     terms: false,
  //     price: 0
  //   },
  //   validationSchema: Yup.object({
  //     price: Yup.number()
  //       .required("Requerido")
  //       .positive("El precio debe ser positivo")
  //       .moreThan(0.09999999999999, "El precio minimo para el NFT es de 0.1")
  //       .min(0.1, "El precio no debe de ser menor 0.1"),
  //     terms: Yup.bool()
  //       .required("Requerido")
  //   }),
  //   //Metodo para el boton ofertar del formulario
  //   onSubmit: async (values) => {
  //     let ofertar;
  //     let contract = await getNearContract();
  //     let payload = {
  //       nft_contract_id: process.env.REACT_APP_CONTRACT,
  //       token_id: props.tokens.tokenID,
  //       owner_id: props.tokens.owner
  //     };
  //     console.log(props.tokens)

  //     let amountVal = values.price;
  //     let amount = fromNearToYocto(amountVal);
  //     let bigAmount = BigInt(amount);
  //     if (!values.terms) {
  //       Swal.fire({
  //         title: t("Modal.transAlert2"),
  //         text: t("Modal.offerAlert1Txt"),
  //         icon: 'error',
  //         confirmButtonColor: '#E79211'
  //       })
  //       return
  //     }
  //     if (props.tokens.bidPrice != "" && values.price <= props.tokens.bidPrice) {
  //       Swal.fire({
  //         title: t("Modal.offerAlert2"),
  //         text: t("Modal.offerAlert2Txt-1"),
  //         icon: 'error',
  //         confirmButtonColor: '#E79211'
  //       })
  //       return
  //     }
  //     ext_call(process.env.REACT_APP_CONTRACT_MARKET, 'add_offer', payload, 300000000000000, amount)


    


  //     setState({ disabled: false });
  //   },
  // });

  return (
    props.show && (
      <>
        <div className="   justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          <div className="w-10/12 md:w-7/12 my-6   rounded ">
            {/*content*/}
            <div className=" shadow-lg  flex flex-col h-full bg-white outline-none focus:outline-none rounded-xlarge">
              {/*header*/}
              <div className="relative p-6 flex">
                
             
                <div
                  name="card"
                  className="rounded-md w-1/2 flex flex-col    "
                >
                  {
                    //h-7/12
                    //     md:h-screen lg:h-screen  xl:h-screen
                  }
                  <div className="w-full h-3/5   overflow-hidden rounded-t-md   bg-[#EBEBEB]">
                    <img
                      className="w-full h-full object-cover object-center "
                      alt="hero"
                      src={`https://nativonft.mypinata.cloud/ipfs/`}
                    />
                  </div>
                  <div
                    name="card_det"
                    className="w-full h-full    rounded-b-md   pt-4 px-4    bg-white  "
                  >
                    <p className=" text-black uppercase text-xs text-ellipsis      font-bold font-open-sans">
                      t("MintNFT.write_title")
                    </p>
                   
                      <p className=" text-black text-xs   font-open-sans tracking-wide	mt-2 ">
                        
                         { t("addToken.comboOpc")}
                           
                      </p>
                   

                    <div className="py-4 flex">
                      {/* <img
                        className=" mt-1 w-5 h-5   "
                        alt="near"
                        src={}
                      /> */}
                    
                      
                        <p className="text-[#F79336] ml-4  font-bold font-open-sans uppercase  text-xs  ">
                           
                          {t("MintNFT.PendingPrice")}
                        </p>
                     
                    </div>

                    <p className="text-black content-en mt-2 mb-2   font-open-sans text-xs   ">
                      {t("tokCollection.createdBy") +
                        ": " +
                        window.localStorage.getItem("logged_account")}{" "}
                    </p>
                  </div>
                </div>
              
              {/* <a className="w-1/2   bg-green-300" >adios</a>
               */}



<div name="nft" hidden={hide_create_col}>
                    {!hide_set_price ? (
                      <p className="my-4  text-base lg:text-lg  xl:text-xl    text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("MintNFT.congratsYourNft")}
                      </p>
                    ) : (
                      <p className="my-4  text-base lg:text-lg xl:text-xl   text-[#0A0A0A] font-open-sans font-bold  ">
                        {t("Modal.price")}
                      </p>
                    )}

                    <div className="w-full flex flex-col gap-2">
                     
                        <>
                          <div className="w-full flex gap-2">
                            <div className="w-[40px] h-[40px] 2xl:w-[55px] 2xl:h-[55px] bg-center  border-2 rounded-full    justify-center items-center">
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
                                className="w-4/6 lg:text-lg xl:text-xl  md:w-1/2 lg:w-4/6  pl-2 h-full"
                                placeholder={new_token_price}
                                onChange={(e) => {
                                  set_new_price(e);
                                }}
                              />

                              <label className="w-2/6 md:w-1/2  lg:w-2/6 py-2 text-sm lg:text-lg xl:text-xl  ">
                                ≈{" "}
                                {(new_token_price * near_price)
                                  .toString()
                                  .substring(0, 6)}{" "}
                                USD
                              </label>
                            </div>
                          </div>
                        </>
                       

                      
                        <>
                          <div name="collections " className="my-4">
                            <div className="flex justify-between ">
                              <label
                                htmlFor="collections"
                                className=" text-sm  dark:text-darkgray   uppercase font-semibold font-raleway"
                              >
                                {t("addToken.addtocol")}
                              </label>
                            </div>

                            {noCollections ? (
                              <>
                                <div
                                  name="collectinos"
                                  className="  justify-center"
                                >
                                  <p className=" my-4 text-center text-2xl leading-relaxed text-darkgray font-raleway">
                                    {/* {props.message} */}
                                  </p>
                                </div>
                                <select
                                  className="text-darkgray p-2 font-raleway"
                                  onChange={(e) => {
                                    console.log(
                                      "🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e",
                                      e.target.value?.key
                                    );
                                    setColID(e.target.value);
                                    setColName(e.target.value);
                                    console.log(
                                      "🪲 ~ file: Mint.view.js ~ line 808 ~ LightHeroE ~ e",
                                      e.target.key
                                    );
                                  }}
                                >
                                  <option key={0} value={-1}>
                                    {t("addToken.comboOpc")}
                                  </option>
                                  {collectionData.length > 0
                                    ? collectionData.map((data) => (
                                        <option
                                          className="bg-indigo-500"
                                          key={data.id}
                                          value={data.id}
                                        >
                                          {data.title} - ID:{data.id}
                                        </option>
                                      ))
                                    : null}
                                </select>

                                <div className="w-full flex ">
                                  <div className="relative group mt-3 rounded-full">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f2b159] to-[#ca7e16] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col  justify-center">
                                  <p className="text-darkgray text-sm text-left underline decoration-solid	  mb-4">
                                    {t("addToken.msgNoCol")}
                                  </p>
                                  <a
                                    className="relative bg-lime-600 text-white text-center font-bold uppercase text-sm px-6 py-3 rounded-md   ease-linear transition-all duration-150  hover:scale-105"
                                    href="/collectionData/create"
                                  >
                                    {t("addToken.btnCol")}
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                     

                      {/*  btn save*/}

                      {hide_set_save && (
                        <>
                          <div className="mt-3">
                            <input
                              type="checkbox"
                              className=""
                              name="terms"
                              id="terms"
                              value={terms}
                              onChange={AcceptTerms}
                            />{" "}
                            <label className="text-sm lg:text-lg xl:text-2xl   text-darkgray">
                              <a className="hover:underline hover:text-blue">
                                {t("Modal.accept")}
                              </a>
                            </label>
                          </div>

                          <button
                            disabled={!terms}
                            title={t("MintNFT.AccetTerms")}
                            className={
                              !terms
                                ? "w-full mt-6 relative rounded-md px-4 py-2 bg-[#A4A2A4]  text-white    text-center hover:scale-105 tracking-tighter uppercase font-open-sans text-xs lg:text-lg xl:text-2xl   font-bold "
                                : "w-full mt-6 relative rounded-md px-4 py-2 bg-green-600   text-white  text-center hover:scale-105 tracking-tighter uppercase font-open-sans text-xs lg:text-lg xl:text-2xl   font-bold "
                            }
                            onClick={(e) => {
                              SetPrice();
                            }}
                          >
                            {t("MintNFT.Savecongrats")}
                          </button>
                        </>
                      )}
                      <button
                        type="submit"
                        onClick={SkipPrice}
                        className={`w-full relative rounded-md px-4 py-2 text-white bg-[#A4A2A4] text-center hover:scale-105  tracking-tighter uppercase font-open-sans text-xs  lg:text-lg xl:text-xl   font-bold `}
                      >
                        {t("MintNFT.Skip")}
                      </button>
                    </div>
                  </div>
               
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    )
  );
}
