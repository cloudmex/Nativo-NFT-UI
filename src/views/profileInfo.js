/* global BigInt */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";
import { isNearReady } from "../utils/near_interaction";
import { providers, utils } from "near-api-js";
import { nearSignIn, ext_view, ext_call } from "../utils/near_interaction";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { currencys, acceptedFormats } from "../utils/constraint";
import {
  fromNearToYocto,
  fromYoctoToNear,
  getNearAccount,
  getNearContract,
} from "../utils/near_interaction";
import flechaiz from "../assets/landingSlider/img/flechaIz.png";
import defaultUser from "../assets/img/Userdefaultprof.png";
import upphoto from "../assets/img/add_a_photo.svg";
import bannerphoto from "../assets/img/bannerprofiledef.svg";
import checkcircle from "../assets/img/checkcircle.svg";

import activity_img from "../assets/img/activity.svg";
import approval_img from "../assets/img/APROVAL.svg";

import { useFormik } from "formik";

import * as Yup from "yup";
import ReactHashtag from "react-hashtag";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { date } from "yup";
import { useWalletSelector } from "../utils/walletSelector";

import { Tab } from "@headlessui/react";
import MyAcquisitions from "../components/MyAcquisitions.component";
import MyCreations from "../components/MyCreations.component";
import MyCollections from "../components/MyCollections.component";
import { async } from "rxjs";
import { uploadFileAPI } from "../utils/pinata";

function LightEcommerceB(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  //guarda el estado de  toda la vista
  const [btn, setbtn] = useState(true);
  const [t, i18n] = useTranslation("global");
  const [stateLogin, setStateLogin] = useState(false);
  const [hasRoyalty, setHasRoyalty] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const [hasBids, setHasBids] = useState(false);
  const [totalAdquisitons, setTotalAdquisitons] = React.useState(0);
  const [totalCreations, setTotalCreations] = React.useState(0);
  const [ErrorIcon, setErrorIcon] = useState(false);
  const [ErrorBanner, setErrorBanner] = useState(false);
  const [ErrorTwitter, setErrorTwitter] = useState(false);
  const [ErrorBio, setErrorBio] = useState(false);

  const [mint, setmint] = React.useState({
    file: undefined,
    icon: "",
    banner: "",
    blockchain: localStorage.getItem("blockchain"),
  });
  const [type, setType] = useState(false);

  //es el parametro de tokenid
  const { state } = useParams();

  const handleLanguage = () => {
    if (window.localStorage.getItem("LanguageState") == "en") {
      i18n.changeLanguage("es");
      window.localStorage.setItem("LanguageState", "es");
    } else {
      i18n.changeLanguage("en");
      window.localStorage.setItem("LanguageState", "en");
    }
  };

  const handleEditProfile = () => {
    console.log("editProfile");
    window.location.href = "/profileData/edit";
  };

  async function addNTVToken() {
    let account = accountId;
    let payload = {
      receiver_id: account,
      amount: "0",
      memo: ":",
    };
    const wallet = await selector.wallet();
    Swal.fire({
      title: t("Footer.msg-ntv-title"),
      text: t("Footer.msg-ntv-desc"),
      icon: "warning",
      confirmButtonColor: "#E79211",
      confirmButtonText: t("Footer.msg-ntv-btn"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Transfer NTV");
        // ext_call(process.env.REACT_APP_CONTRACT_TOKEN, 'ft_transfer', payload, 300000000000000, 1)
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_TOKEN,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "ft_transfer",
                args: payload,
                gas: 300000000000000,
                deposit: 1,
              },
            },
          ],
        });
      }
    });
  }
  //es el historial de busqueda
  let history = useHistory();
  const APIURL = process.env.REACT_APP_API_TG;

  const cancelprofile =()=>{


    



    Swal.fire({
      background: '#0a0a0a',
      width: '500',
      height: '600',

      html:
        '<div class=" flex flex-col overflow-hidden">' +
        '<div class="font-open-sans  text-base font-extrabold text-white my-2 text-left w-full uppercase">' +   t("Profile.CancelProfile_title") + '</div>' +
        '<div class="font-open-sans  text-sm font-bold text-white my-2 text-left w-full uppercase">' +   t("Profile.CancelProfile_descrip") + '</div>' +

        '</div>',
      showCloseButton: true,
      confirmButtonText:  t("Profile.CancelProfile_cancel"),
      cancelButtonText:  t("Profile.CancelProfile_no"),
      showCancelButton: true,
      showConfirmButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:'flex py-2 h-[40px] w-[150px]    lg:w-[200px] text-white       font-open-sans font-normal lg:font-extrabold text-base uppercase  hover:text-textOutlineHover active:text-textOutlinePressed   font-extrabold h-full     border-solid border-2 rounded-md border-white2   " ' ,
        cancelButton: 'flex py-2 h-[40px] w-[150px]   ml-2  lg:w-[200px] text-white       font-open-sans font-normal lg:font-extrabold text-base uppercase  hover:text-textOutlineHover active:text-textOutlinePressed   font-extrabold h-full     border-solid border-2 rounded-md border-white2   " ',
      },
      position: window.innerWidth < 1024 ? 'bottom' : 'center'
    }).then((result) => {
        if (result.isConfirmed) {
            history.goBack();
        } 
        if(result.dismiss == 'cancel') {
            Swal.close()
        }
      });
  }
  const KeepCreatingprofile =()=>{


    



    Swal.fire({
      background: '#0a0a0a',
      width: '500',
      height: '600',

      html:
        '<div class=" flex flex-col overflow-hidden">' +
        '<div class="font-open-sans  text-base font-extrabold text-white my-2 text-left w-full uppercase">' +   t("Profile.KeepcreatinProfile") + '</div>' +
        '<div class="font-open-sans  text-sm font-bold text-white my-2 text-left w-full uppercase">' +   t("Profile.KeepcreatinProfile_descr") + '</div>' +

        '</div>',
      showCloseButton: true,
      confirmButtonText:  t("Profile.KeepcreatinProfile_ok"),
     // cancelButtonText:  t("Profile.CancelProfile_no"),
      showCancelButton: false,
      showConfirmButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:'flex py-2 h-[40px] w-[150px]    lg:w-[200px] text-white       font-open-sans font-normal lg:font-extrabold text-base uppercase  hover:text-textOutlineHover active:text-textOutlinePressed   font-extrabold h-full     border-solid border-2 rounded-md border-white2   " ' ,
       // cancelButton: 'flex py-2 h-[40px] w-[150px]   ml-2  lg:w-[200px] text-white       font-open-sans font-normal lg:font-extrabold text-base uppercase  hover:text-textOutlineHover active:text-textOutlinePressed   font-extrabold h-full     border-solid border-2 rounded-md border-white2   " ',
      },
      position: window.innerWidth < 1024 ? 'bottom' : 'center'
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.close()
        } 
       
      });
  }
  React.useEffect(() => {
    (async () => {
      let type = state;
      let totalTokensByOwner = 0;
      let totalTokensByCreator = 0;
      let userData
      let account = accountId;
      console.log("🪲 ~ file: profileInfo.js:121 ~ state", state);

     
      console.log("Entro a editar");
      let paramsSupply = {
        account_id: account
      };
      const args_b64 = btoa(JSON.stringify(paramsSupply))
      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
      const owner = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_supply_for_owner",
        args_base64: args_b64,
        finality: "optimistic",
      })
       totalTokensByOwner = JSON.parse(Buffer.from(owner.result).toString())
       console.log("🪲 ~ file: profileInfo.js:186 ~ totalTokensByOwner", totalTokensByOwner)
       const creator = await provider.query({
        request_type: "call_function",
        account_id: process.env.REACT_APP_CONTRACT,
        method_name: "nft_supply_for_creator",
        args_base64: args_b64,
        finality: "optimistic",
      })
      totalTokensByCreator = JSON.parse(Buffer.from(creator.result).toString())
      console.log("🪲 ~ file: profileInfo.js:194 ~ totalTokensByCreator", totalTokensByCreator)
      
      setTotalAdquisitons(totalTokensByOwner);
      setTotalCreations(totalTokensByCreator);

      const query = `
          query ($account: String){
            profiles (where : {id : $account}){
              id
              media
              mediaBanner
              biography
              socialMedia
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
          console.log("profile: ", data?.data.profiles[0]);
          if (data?.data.profiles.length <= 0 && state === "edit") {
            window.location.href = "/profileData/create";
          }
          if (data?.data.profiles.length > 0 && state === "create") {
            window.location.href = "/profileData/edit";
          }

          if (data?.data.profiles.length > 0 && state === "edit") {
            setType(true);
            userData = data.data.profiles[0];
            formik.setFieldValue("bio", userData.biography);
            formik.setFieldValue("twitter", userData.socialMedia);
            formik.setFieldValue("icon", userData.media);
            formik.setFieldValue("banner", userData.mediaBanner);

            setmint({
              ...mint,
              icon: `https://nativonft.mypinata.cloud/ipfs/${userData.media}`,
              banner:
                userData.mediaBanner === ""
                  ? ""
                  : `https://nativonft.mypinata.cloud/ipfs/${userData.mediaBanner}`,
            });
          }
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    })();
  }, []);

  function clickTab(evt) {
    console.log("evt", evt);
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  async function handleCreatebutton() {
    Swal.fire({
      background: "#0a0a0a",
      width: "500",
      heightAuto: false,
      html:
        '<div class=" flex flex-col overflow-hidden">' +
        '<div class="font-open-sans  text-base font-extrabold text-white my-4 text-left w-full uppercase">' +
        t("Navbar.createMsg") +
        "</div>" +
        "</div>",
      showCloseButton: true,
      confirmButtonText: t("Navbar.create"),
      cancelButtonText: t("Navbar.createCollection"),
      showCancelButton: true,
      showConfirmButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          'flex py-2 h-[40px] w-[150px] md:w-[200px]  h-[65px]   lg:w-[200px] text-white tracking-tighter  font-open-sans font-normal lg:font-extrabold text-md uppercase  hover:text-textOutlineHover active:text-textOutlinePressed  border-solid border-2 rounded-md border-white2   " ',
        cancelButton:
          'flex py-2 h-[40px] w-[150px] md:w-[200px] h-[65px]   lg:w-[200px] ml-2 md:ml-10 px-2 text-white tracking-tighter  font-open-sans font-normal lg:font-extrabold text-md uppercase  hover:text-textOutlineHover active:text-textOutlinePressed  border-solid border-2 rounded-md border-white2    " ',
      },
      position: window.innerWidth < 1024 ? "bottom" : "center",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/create";
      }
      if (result.dismiss == "cancel") {
        window.location.href = "/collectionData/create";
      }
    });
  }

  const formik = useFormik({
    initialValues: {
      bio: "",
      twitter: "",
      icon: "",
      banner: "",
    },
    //validaciones
    validationSchema: Yup.object({
      bio: Yup.string()
        .max(1000, t("MintNFT.maxDesc"))
        .required(t("MintNFT.required"))
        .min(5, t("Profile.minBio")),

      twitter: Yup.string()
        .max(15, t("Profile.maxSocial"))
        .required(t("MintNFT.required"))
        .min(4, t("Profile.minSocial")),

      icon: Yup.string().required(t("MintNFT.required")),
      banner: Yup.string().required(t("MintNFT.required")),
    }),
    onSubmit: async (values) => {
      //evitar que el usuario pueda volver a hacer click hasta que termine el minado
      setmint({ ...mint, onSubmitDisabled: true });
      let account;
      if (mint.blockchain == "0") {
        return;
      } else {
        let account = accountId;
        let action = "create";
        if (type) {
          action = "edit";
        }
        let payload = {
          username: account,
          media: values.icon,
          media_banner: values.banner,
          biography: values.bio,
          social_media: values.twitter,
          _type: action,
        };
        console.log(
          "🪲 ~ file: profileInfo.js:254 ~ onSubmit: ~ payload",
          payload
        );
        return;
        const wallet = await selector.wallet();
        wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: process.env.REACT_APP_CONTRACT_MARKET,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "add_new_profile",
                args: payload,
                gas: 300000000000000,
                deposit: 0,
              },
            },
          ],
        });
      }
      //if de error
      //test
    },
  });

  const handleIcon = () => {
    alert("clicked");
  };
  async function uploadFilePinata(e, _rtype) {
    console.log(
      "🪲 ~ file: profileInfo.js:339 ~ uploadFilePinata ~ _rtype",
      _rtype
    );

    let file = e.target.files[0];
    console.log(
      "🪲 ~ file: Mint.view.js ~ line 477 ~ uploadFilePinata ~ file",
      file
    );

    if (_rtype === 0) {
      setmint({
        ...mint,
        icon: URL.createObjectURL(e.target.files[0]),
        icon_name: file?.name,
      });
      let cid = await uploadFileAPI(file);
      formik.setFieldValue("icon", cid);
      console.log(cid);
    } else {
      setmint({
        ...mint,
        banner: URL.createObjectURL(e.target.files[0]),
        banner_name: file?.name,
      });
      let cid = await uploadFileAPI(file);
      formik.setFieldValue("banner", cid);
      console.log(cid);
    }
  }
  function imageClick() {
    formik.setFieldTouched("icon");
    console.log(formik.values);
  }
  const CreateProfile = async () => {
    let account = accountId;
    let action = "create";
    let values = formik.values;

    //values.icon === "" ? setErrorIcon(true):null;

    if (values.icon === "") {
      setErrorIcon(true);
      return;
    }
    if (values.banner === "") {
      setErrorBanner(true);
      return;
    }
    if (values.twitter === "") {
      setErrorTwitter(true);
      return;
    }
    if (values.twitter === "") {
      setErrorBio(true);
      return;
    }

    if (type) {
      action = "edit";
    }
    let payload = {
      username: account,
      media: values.icon,
      media_banner: values.banner,
      biography: values.bio,
      social_media: values.twitter,
      _type: action,
    };
    console.log(payload);

    const wallet = await selector.wallet();
    wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: process.env.REACT_APP_CONTRACT_MARKET,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "add_new_profile",
            args: payload,
            gas: 300000000000000,
            deposit: 0,
          },
        },
      ],
    });
  };
  return (
    <>
      {/* bg-no-repeat bg-cover bg-center bg-[#F3F0F5] lg:bg-Hero_profile */}
      <section className="text-gray-600 body-font  h-[780px]  mb-6 lg:h-[421px] lg:flex lg:flex-row  ">
        <div className="  w-full absolute  h-[220px] lg:h-[440px]  bg-[#F3F0F5] z-10  ">
          {/* <img
            alt="banner"
            className="lg:h-auto h-56 object-cover w-full my-auto "
            src={
              state?.data.media == ""
                ? bannerphoto
                : `https://nativonft.mypinata.cloud/ipfs/${state?.data.media}`
            }
          /> */}
          <label className={`bg-black `}>
            <div className="flex w-full  ">
              <div className="flex flex-col         rounded-md justify-center  text-center   w-full ">
                {mint?.banner === "" ? null : (
                  <img
                    alt="banner"
                    className=" lg:h-[28rem] h-56 object-cover w-full my-auto  "
                    src={`https://nativonft.mypinata.cloud/ipfs/${formik.values.banner}`}
                  />
                )}
              </div>
            </div>
            <input
              onChange={(e) => {
                uploadFilePinata(e, 1);
              }}
              type="file"
              id="image"
              name="image"
              className={`  hidden `}
              accept={acceptedFormats}
            />
          </label>
        </div>

        <form  className="container w-full m-auto lg:mx-[25px]  py-6 lg:py-8 inherit z-10 relative "
          onSubmit={formik.handleSubmit}
        >
          <div className="lg:w-full  flex flex-wrap lg:flex-nowrap lg:h-[335px]">
            {/*Profile Pic*/}
            <div className="xl:w-1/4 2xl:w-1/4   ml-5   flex  ">
              <label className={`hover:cursor-pointer`}>
                <div className="flex w-full  ">
                  <div className="flex flex-col         rounded-md justify-center  text-center   w-full ">
                    <img
                      alt="icon"
                      className="   object-cover  rounded-xlarge border-8 border-white bg-white  w-[180px]  h-[180px] lg:h-[339px] lg:w-[339px]   "
                      src={
                        mint?.icon == ""
                          ? defaultUser
                          : `https://nativonft.mypinata.cloud/ipfs/${formik.values.icon}`
                      }
                    />
                  </div>
                </div>
                <input
                  onChange={(e) => {
                    uploadFilePinata(e, 0);
                  }}
                  onClick={imageClick}
                  type="file"
                  id="image"
                  name="image"
                  className={`  hidden `}
                  accept={acceptedFormats}
                />
              </label>

              <div
                name="text img"
                className=" w-[100px] flex rounded-lg flex-col  justify-center  absolute      "
              >
                <span className="absolute    w-[130px] bg-white text-black  translate-x-[1.5rem] lg:translate-x-[7rem]  translate-y-[10.50rem] lg:translate-y-[20rem]   text-md tracking-tighter	 rounded-sm	   m-auto ">
                  <div className="flex relative">
                  <div className="w-10 h-5 ">
                      <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V6C0 5.45 0.196 4.97933 0.588 4.588C0.979333 4.196 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM10 16.5C11.25 16.5 12.3127 16.0627 13.188 15.188C14.0627 14.3127 14.5 13.25 14.5 12C14.5 10.75 14.0627 9.68733 13.188 8.812C12.3127 7.93733 11.25 7.5 10 7.5C8.75 7.5 7.68733 7.93733 6.812 8.812C5.93733 9.68733 5.5 10.75 5.5 12C5.5 13.25 5.93733 14.3127 6.812 15.188C7.68733 16.0627 8.75 16.5 10 16.5ZM10 14.5C9.3 14.5 8.70833 14.2583 8.225 13.775C7.74167 13.2917 7.5 12.7 7.5 12C7.5 11.3 7.74167 10.7083 8.225 10.225C8.70833 9.74167 9.3 9.5 10 9.5C10.7 9.5 11.2917 9.74167 11.775 10.225C12.2583 10.7083 12.5 11.3 12.5 12C12.5 12.7 12.2583 13.2917 11.775 13.775C11.2917 14.2583 10.7 14.5 10 14.5Z" 
                        fill={mint?.banner ? `#616161`:`#616161`}/>
                        </svg>
                  </div>
                    {t("Profile.upImg2")}
                  </div>

                  {formik.touched.icon && formik.errors.icon ? (
                    <div className=" w-full  absolute    text-center text-md text-red-600 font-open-sans">
                      {formik.errors.icon}
                    </div>
                  ) : null}
                </span>
              </div>

              <label name="upbanner" className="absolute  flex lg:hidden w-[170px] mdw-[200px] tracking-tighter bg-white text-black  translate-x-[13.5rem]  md:translate-x-[35rem] translate-y-[11.5rem] lg:translate-y-[21rem]    text-sm md:text-base 	 rounded-sm	  m-auto ">
             <div className="w-10 h-10">
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V6C0 5.45 0.196 4.97933 0.588 4.588C0.979333 4.196 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM10 16.5C11.25 16.5 12.3127 16.0627 13.188 15.188C14.0627 14.3127 14.5 13.25 14.5 12C14.5 10.75 14.0627 9.68733 13.188 8.812C12.3127 7.93733 11.25 7.5 10 7.5C8.75 7.5 7.68733 7.93733 6.812 8.812C5.93733 9.68733 5.5 10.75 5.5 12C5.5 13.25 5.93733 14.3127 6.812 15.188C7.68733 16.0627 8.75 16.5 10 16.5ZM10 14.5C9.3 14.5 8.70833 14.2583 8.225 13.775C7.74167 13.2917 7.5 12.7 7.5 12C7.5 11.3 7.74167 10.7083 8.225 10.225C8.70833 9.74167 9.3 9.5 10 9.5C10.7 9.5 11.2917 9.74167 11.775 10.225C12.2583 10.7083 12.5 11.3 12.5 12C12.5 12.7 12.2583 13.2917 11.775 13.775C11.2917 14.2583 10.7 14.5 10 14.5Z" 
                  fill={mint?.banner ? `#616161`:`#616161`}/>
                  </svg>
             </div>
            
                {t("Profile.upImg4")}
                <input
              onChange={(e) => {
                uploadFilePinata(e, 1);
              }}
              type="file"
              id="image"
              name="image"
              className={`  hidden `}
              accept={acceptedFormats}
            />
                {formik.touched.banner && formik.errors.banner ? (
                  <div className=" absolute w-full -mt-4 text-center text-md   text-red-600 font-open-sans">
                    {formik.errors.banner}
                  </div>
                ) : null}
              </label>
              
              <button name="createpro" className=" w-[40px]  absolute translate-x-[13rem]  md:translate-x-[36rem] lg:translate-x-[49.75rem]   xl:translate-x-[64.25rem]  2xl:translate-x-[77.5rem]  rounded-full "
              
              onClick={cancelprofile}
              data-bs-toggle="tooltip" data-bs-placement="bottom" title= {t("Profile.CancelProfile_title")}
              >
                 
                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="20" cy="20" r="18.5" stroke="#CE5222" stroke-width="3"/>
 
<g mask="url(#mask0_394_32482)">
<path d="M14.3992 27.8L12.1992 25.6L17.7992 20L12.1992 14.4L14.3992 12.2L19.9992 17.8L25.5992 12.2L27.7992 14.4L22.1992 20L27.7992 25.6L25.5992 27.8L19.9992 22.2L14.3992 27.8Z" fill="#CE5222"/>
</g>
</svg>

 

                
              </button>

              <button className="  w-[40px]  -mt-4 absolute translate-x-[18.5rem]    rounded-full md:translate-x-[43rem] lg:translate-x-[56rem]  xl:translate-x-[75rem] 2xl:translate-x-[91rem]    "
             
              onClick={CreateProfile}
              data-bs-toggle="tooltip" data-bs-placement="bottom" title= {t("Profile.title")}
              >
                 
                <span class="flex h-4 w-4 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow2 opacity-75"></span>
                  <span class="absolute inline-flex rounded-full h-4 w-4 bg-yellow2"></span>
                </span>
                <svg className="  rounded-full" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">

                  <circle cx="20" cy="20" r="18.5" stroke="#F79336" stroke-width="3"/>
                  <g mask="url(#mask0_1_2)">
                  <path d="M17.5498 26.8L11.0498 20.3L13.2998 18.05L17.5498 22.3L26.6998 13.15L28.9498 15.4L17.5498 26.8Z" fill="#F79336"/>
                  </g>
                  </svg>
                    
            </button>
            </div>

            <div className="xl:w-3/4 2xl:w-3/4 lg:w-2/3  w-full lg:flex lg:flex-row lg:gap-4 xl:gap-12 mt-10 lg:mt-2 flex-col px-5 bg-white lg:bg-transparent ">
              <div name="userInfocard" className="lg:w-1/2">
                {/*User account*/}

                <label className={ mint?.banner ? 
                `hidden  ` 
                :
                `hidden mt-4 lg:flex  hover:cursor-pointer w-[200px]      text-[#616161]     text-md tracking-tighter	 	  `}                >
                
                <div className="  w-4 h-4  mx-2 "     
                  >   <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6V4H16V2H18V0H20V2H22V4H20V6H18ZM2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V6C0 5.45 0.196 4.97933 0.588 4.588C0.979333 4.196 1.45 4 2 4H5.15L7 2H13V4H7.875L6.05 6H2V18H18V9H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H2ZM10 16.5C11.25 16.5 12.3127 16.0627 13.188 15.188C14.0627 14.3127 14.5 13.25 14.5 12C14.5 10.75 14.0627 9.68733 13.188 8.812C12.3127 7.93733 11.25 7.5 10 7.5C8.75 7.5 7.68733 7.93733 6.812 8.812C5.93733 9.68733 5.5 10.75 5.5 12C5.5 13.25 5.93733 14.3127 6.812 15.188C7.68733 16.0627 8.75 16.5 10 16.5ZM10 14.5C9.3 14.5 8.70833 14.2583 8.225 13.775C7.74167 13.2917 7.5 12.7 7.5 12C7.5 11.3 7.74167 10.7083 8.225 10.225C8.70833 9.74167 9.3 9.5 10 9.5C10.7 9.5 11.2917 9.74167 11.775 10.225C12.2583 10.7083 12.5 11.3 12.5 12C12.5 12.7 12.2583 13.2917 11.775 13.775C11.2917 14.2583 10.7 14.5 10 14.5Z" 
                  fill={mint?.banner ? `#616161`:`#616161`}/>
                  </svg></div>
                  {t("Profile.upImg3")}

             <input  onChange={(e) => {
                 uploadFilePinata(e, 1);
               }}
               type="file"
               id="image"
               name="image"
               className={`  hidden `}
               accept={acceptedFormats}
             />
              {formik.touched.banner && formik.errors.banner ? (
                    <div className=" absolute pl-[200px]  text-center text-md text-red-600 font-open-sans">
                      {formik.errors.banner}
                    </div>
                  ) : null}
           </label>
               

                <h1 className={mint?.banner ?
                 `text-[#0A0A0A] lg:text-slate-300 capitalize text-2xl text-left title-font font-bold mb-2 mt-4 font-open-sans text-ellipsis  leading-8`
                :`text-[#0A0A0A] lg:text-black capitalize text-2xl text-left title-font font-bold mb-2 font-open-sans text-ellipsis  leading-8`}
              >
                  {accountId}
                </h1>
                <div className="flex justify-between ">
                  {formik.touched.twitter && formik.errors.twitter ? (
                    <div className="leading-7     text-sm text-red-600 font-open-sans">
                      {formik.errors.twitter}
                    </div>
                  ) : null}
                  {ErrorTwitter && (
                    <div className="leading-7    text-sm text-red-600 font-open-sans">
                      {formik.errors.twitter}
                    </div>
                  )}
                </div>
                <div className="flex justify-between    border-dotted border-2 border-slate-300 rounded-md w-full  h-[50px]  mb-4   ">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder={t("Profile.twitter")}
                    {...formik.getFieldProps("twitter")}
                    className={  
                      mint?.banner ? 
                      `font-open-sans  mx-2 flex flex-col  h-full   bg-transparent  text-black lg:text-slate-300   text-left   justify-center   w-full`
                      : 
                     `font-open-sans  mx-2 flex flex-col  h-full   bg-transparent text-[#616161]    text-left   justify-center   w-full`}
                  />
                  <div className="w-[24px] h-[24px]   flex items-center my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="15"
                      viewBox="0 0 18 15"
                      fill="none"
                    >
                      <path
                        d="M16.1572 3.53809C16.1682 3.68964 16.1682 3.84119 16.1682 3.99415C16.1682 8.6546 12.4534 14.0295 5.6607 14.0295V14.0267C3.65411 14.0295 1.68921 13.4806 0 12.4455C0.291773 12.4791 0.585009 12.4958 0.878976 12.4965C2.54186 12.4979 4.15722 11.965 5.46545 10.9838C3.88519 10.9551 2.49945 9.97109 2.01536 8.53447C2.56892 8.63644 3.13931 8.61549 3.68263 8.47371C1.95978 8.14127 0.720293 6.69557 0.720293 5.01661C0.720293 5.00125 0.720293 4.98658 0.720293 4.97191C1.23364 5.24499 1.80841 5.39654 2.39634 5.4133C0.773675 4.37757 0.273492 2.31588 1.25338 0.703961C3.12834 2.90743 5.8947 4.24697 8.86435 4.38874C8.56673 3.16374 8.97331 1.88007 9.93272 1.01894C11.4201 -0.316408 13.7594 -0.247965 15.1576 1.17189C15.9846 1.01615 16.7773 0.72631 17.5027 0.315648C17.2271 1.13208 16.6501 1.8256 15.8793 2.26629C16.6113 2.18388 17.3265 1.99671 18 1.71106C17.5042 2.42064 16.8797 3.03873 16.1572 3.53809Z"
                        fill={ mint?.banner ?  `#ffffff` : ` #A4A2A4`}
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between ">
                  {formik.touched.bio && formik.errors.bio ? (
                    <div className="leading-7   text-sm text-red-600 font-open-sans">
                      {formik.errors.bio}
                    </div>
                  ) : null}
                </div>

                <div className="flex rounded-md border-2 border-dotted border-slate-300   h-[170px]    p-[2px]    ">
                  <textarea
                    id="title"
                    name="title"
                    placeholder={t("Profile.addbiography")}
                    {...formik.getFieldProps("bio")}
                    className={  mint?.banner ?  
                      `font-open-sans mx-2  flex flex-col  h-full  bg-transparent   text-black lg:text-slate-300 stroke-black stroke-1 text-left  justify-center    w-full`
                      :
                      `font-open-sans mx-2  flex flex-col  h-full  bg-transparent    text-slate-300]  text-left  justify-center    w-full`}
                  />
                </div>
              </div>

              <div name="userInfocard-right" className="lg:w-1/2 lg:mt-auto">
                <div name="activitySection" className="w-full mt-4 flex gap-4">
                  <button   disabled="true" className="w-1/2 h-24 rounded-lg shadow-xl flex flex-col items-center justify-center lg:bg-gray-200 hover:bg-gray-300">
                    <img
                      alt="activity_img"
                      className="  w-10 h-10  mx-2 "
                      src={activity_img}
                    />
                    <a className="font-bold">{t("Profile.activity")}</a>
                  </button>
                  <button   disabled="true" className="w-1/2 h-24 rounded-lg shadow-xl flex flex-col items-center  justify-center lg:bg-gray-200 hover:bg-gray-300"> 
                    <img
                      alt="activity_img"
                      className="  w-10 h-10  mx-2 "
                      src={approval_img}
                    />
                    <a className="font-bold">{t("Profile.offers")}</a>
                  </button>
                </div>

                <div className="relative group mt-5 rounded-md ">
                  <div className="absolute -inset-0.5  rounded-md blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt group-hover:-inset-1"></div>
                  <button
                   disabled="true"
                    onClick={handleCreatebutton}
                    className={`relative w-full   rounded-md uppercase font-open-sans text-base px-6 py-2 font-bold  bg-gray-200 hover:bg-gray-300 text-black`}
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title= {t("Profile.createProfile")}
                  >
                    {  t("Profile.createProfile")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*User secitons*/}
          
        </form>
       
      </section>
      
      { state !="edit" ? null:
       <div className="w-full bg-white container mx-auto pb-5">
       <div className="font-open-sans font-bold text-3xl text-black px-5 pb-4 xl:pt-4">
         <p className="">{t("MyNFTs.userNft")}</p>
       </div>
   <Tab.Group>
     <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mx-5  xl:w-1/2 overflow-scroll lg:overflow-hidden">
     <Tab
         key={"Creaciones"}
         className={({ selected }) =>
           classNames(
             'w-1/3 md:w-full py-1.5   leading-8 font-bold text-xs sm:text-base lg:text-2xl',
             'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 font-open-sans    font-bold ',
             selected
               ? 'bg-white  text-darkgray  border-b-2 border-yellow2'
               : 'font-open-sans text-[#616161] '
           )
         }
       >
         {t("MyNFTs.creations")  + " " + (totalCreations > 1000 ? "(1K+)" : totalCreations )}
       </Tab>
       <Tab
         key={"MisTokens"}
         className={({ selected }) =>
           classNames(
             'w-1/3 md:w-full py-1.5    leading-8 font-bold text-xs sm:text-base lg:text-2xl ',
             'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 font-open-sans  font-bold ',
             selected
               ? 'bg-white  text-darkgray  border-b-2 border-yellow2 direction-rtl'
               : 'font-open-sans text-[#616161] '
           )
         }
       >
         {t("MyNFTs.adquisitions") + " " + (totalAdquisitons > 1000 ? "(1K+)" : totalAdquisitons )} 
       </Tab>
      
       <Tab
         key={"Colecciones"}
         className={({ selected }) =>
           classNames(
             'w-1/3 md:w-full py-1.5    leading-8 font-bold text-xs sm:text-base lg:text-2xl',
             'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 font-open-sans    font-bold ',
             selected
               ? 'bg-white  text-darkgray  border-b-2 border-yellow2 direction-ltr'
               : 'font-open-sans text-[#616161] '
           )
         }
       >
         {t("MyNFTs.collections")}
       </Tab>
     </Tab.List>
     <Tab.Panels className="mt-2 bg-white">

     <Tab.Panel
         key={"Creaciones"}
         className={classNames(
           'rounded-xl   bg-white'
         )}
       >
        {totalCreations ==0 ?
        <>

<div className="px-6 w-full pb-6  flex flex-row-reverse">
          <select name="sort" className="text-base font-open-sans pl-3 py-2.5 border-outlinePressed dark:text-black md:w-[283px]"  >
            <option value="" disabled selected hidden>{t("Explore.sortBy")}</option>
            <option value="recentOld">{t("Explore.sortTimeRec")}</option>
            <option value="oldRecent">{t("Explore.sortTimeOld")}</option>
          </select>
        </div>

  <div className="w-full lg:ml-16 xs:w-[150px] sm:w-[180px] md:w-[160px] lg:w-[232px]  xl:w-[295px] 2xl:w-[284px] h-[279px] lg:h-[500px]      xl:h-[395px] 2xl:h-[485px] ">
         <a
           onClick={KeepCreatingprofile}
         >
           <div className="flex flex-row justify-center ml-10   bg-white" >
             <div className="h-full rounded-xl shadow-lg  hover:scale-105 ">
               <div className="w-[163px] lg:w-[340px] h-[284px]  shadow-lg  rounded-xl">
                 <div className=" h-[163px] lg:h-[340px]  bg-yellow2 rounded-t-lg flex  justify-center  content-center  ">
                  <div className="flex   items-center">
                    <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.5">
                      
                      <g mask="url(#mask0_41_2628)">
                      <path d="M39.1396 52.9993H43.0995V43.16H52.9993V39.1396H43.0995V29.0007H39.1396V39.1396H29.0007V43.16H39.1396V52.9993ZM41 65C37.6804 65 34.5705 64.3698 31.6704 63.1093C28.7703 61.8498 26.2302 60.13 24.0501 57.9499C21.87 55.7698 20.1502 53.2297 18.8907 50.3296C17.6302 47.4295 17 44.3196 17 41C17 37.6804 17.6302 34.5604 18.8907 31.6402C20.1502 28.7199 21.87 26.1798 24.0501 24.0199C26.2302 21.8599 28.7703 20.1502 31.6704 18.8907C34.5705 17.6302 37.6804 17 41 17C44.3196 17 47.4396 17.6302 50.3598 18.8907C53.2801 20.1502 55.8202 21.8599 57.9801 24.0199C60.1401 26.1798 61.8498 28.7199 63.1093 31.6402C64.3698 34.5604 65 37.6804 65 41C65 44.3196 64.3698 47.4295 63.1093 50.3296C61.8498 53.2297 60.1401 55.7698 57.9801 57.9499C55.8202 60.13 53.2801 61.8498 50.3598 63.1093C47.4396 64.3698 44.3196 65 41 65ZM41 60.9796C46.5602 60.9796 51.28 59.0395 55.1592 55.1592C59.0395 51.28 60.9796 46.5602 60.9796 41C60.9796 35.4398 59.0496 30.72 55.1895 26.8408C51.3294 22.9605 46.5996 21.0204 41 21.0204C35.4398 21.0204 30.72 22.9504 26.8408 26.8105C22.9605 30.6706 21.0204 35.4004 21.0204 41C21.0204 46.5602 22.9605 51.28 26.8408 55.1592C30.72 59.0395 35.4398 60.9796 41 60.9796Z" fill="#FDFCFD"/>
                      </g>
                      </g>
                      </svg>
                  </div> 
                 </div>
                 <div className="w-[163px] lg:w-[340px] h-[121px] shadow-lg flex  justify-center  items-center ">
                   <p className="w-full h-full text-black  leading-6 text-xl lg:text-4xl font-semibold   font-open-sans text-center px-3 py-2 ">{t("Profile.add-new")}</p>
                   
                 </div>
               </div>
             </div>
           </div>
         </a>
       </div>

          </>
       
      :
          <MyCreations />  
        }
       </Tab.Panel>
       <Tab.Panel
         key={"MisTokens"}
         className={classNames(
           'rounded-xl  bg-white'
         )}
       >
         {/* <MyAcquisitions /> */}
       </Tab.Panel>
      

       <Tab.Panel
         key={"Colecciones"}
         className={classNames(
           'rounded-xl  bg-white'
         )}
       >
         {/* <MyCollections /> */}
       </Tab.Panel>
     </Tab.Panels>
   </Tab.Group>

     </div>
      }              
    </>
  );
}

LightEcommerceB.defaultProps = {
  theme: "yellow",
};

LightEcommerceB.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default LightEcommerceB;
