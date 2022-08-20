import React from "react";
import {
    getContract,
    syncNets,
} from "../utils/blockchain_interaction";
import { currencys } from "../utils/constraint";
import { getNearContract, fromYoctoToNear, getNearAccount } from "../utils/near_interaction";
import { useParams, useHistory } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import verifyImage from '../assets/img/Check.png';
import nativoLogo from '../assets/img/logo_nativo.png'
import discordLogo from '../assets/img/discord_logo.svg'
import discord from '../assets/img/discord.png'
import mediumLogo from '../assets/img/medium_logo.svg'
import medium from '../assets/img/medium.png'
import twitterLogo from '../assets/img/twitter_logo.svg'
import twitter from '../assets/img/twitter.png'
import telegramLogo from '../assets/img/telegram_logo.svg'
import telegram from '../assets/img/telegram.png'
import githubLogo from '../assets/img/github_logo.svg'
import github from '../assets/img/github.png'

function Community() {
    const [Landing, setLanding] = React.useState({
        theme: "yellow",
        currency: currencys[parseInt(localStorage.getItem("blockchain"))],
        tokens: [],
        page: parseInt(window.localStorage.getItem("page")),
        pag: window.localStorage.getItem("pagSale"),
        blockchain: localStorage.getItem("blockchain"),
        tokensPerPage: 9,
        tokensPerPageNear: 9,
    });

    return (
        <section className={"text-gray-600 body-font pt-20 dark:bg-darkgray"}>
            <div className="mx-auto grid min-h-[50vh] grid-cols-1 gap-10 sm:max-w-[2000px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center">
                
                {/* Discord */}
                <a href="https://discord.gg/q2R6rtY4ks" target="_blank">
                    <div className="flex items-center min-h-[350px] max-h-[350px] min-w-[320px] max-w-[320px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group hover:bg-black" style={{ backgroundImage: `url(${discord})` }}>
                        <a href="https://discord.gg/q2R6rtY4ks" target="_blank" className="w-full">
                            <img className="rounded-t-lg mx-auto opacity-20 transition-opacity group-hover:opacity-100 group-hover:bg-yellow2 pr-[5px] rounded group-hover:shadow-yellow1 group-hover:bg-opacity-90	" src={discordLogo} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Medium */}
                <a href="https://nativonft.medium.com/" target="_blank">
                    <div className="flex items-center min-h-[350px] max-h-[350px] min-w-[320px] max-w-[320px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group" style={{ backgroundImage: `url(${medium})` }}>
                        <a href="https://nativonft.medium.com/" target="_blank" className="w-full">
                            <img className="rounded-t-lg mx-auto opacity-20 transition-opacity group-hover:opacity-100 group-hover:bg-yellow2 px-[5px] py-[2px] rounded group-hover:shadow-yellow1 group-hover:bg-opacity-90	" src={mediumLogo} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Twitter */}
                <a href="https://twitter.com/nativonft" target="_blank">
                    <div className="flex items-center min-h-[350px] max-h-[350px] min-w-[320px] max-w-[320px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group" style={{ backgroundImage: `url(${twitter})` }}>
                        <a href="https://twitter.com/nativonft" target="_blank" className="w-full">
                            <img className="rounded-t-lg mx-auto opacity-20 transition-opacity group-hover:opacity-100 group-hover:bg-yellow2 pr-[5px] rounded group-hover:shadow-yellow1 group-hover:bg-opacity-90	" src={twitterLogo} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Telegram */}
                <a href="https://t.me/+TFdhJmJzwmkwNDQx" target="_blank">
                    <div className="flex items-center min-h-[350px] max-h-[350px] min-w-[320px] max-w-[320px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group" style={{ backgroundImage: `url(${telegram})` }}>
                        <a href="https://t.me/+TFdhJmJzwmkwNDQx" target="_blank" className="w-full">
                            <img className="rounded-t-lg mx-auto opacity-20 transition-opacity group-hover:opacity-100 group-hover:bg-yellow2 px-[5px] py-[2px] rounded group-hover:shadow-yellow1 group-hover:bg-opacity-90	" src={telegramLogo} alt="" />
                        </a>
                    </div>
                </a>
                
                {/* Github */}
                <a href="https://github.com/cloudmex/Nativo-NFT-UI" target="_blank">
                    <div className="flex items-center min-h-[350px] max-h-[350px] min-w-[320px] max-w-[320px] m-5 bg-white rounded-[50px] border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-yellow1 hover:scale-105 overflow-hidden group" style={{ backgroundImage: `url(${github})` }}>
                        <a href="https://github.com/cloudmex/Nativo-NFT-UI" target="_blank" className="w-full">
                            <img className="rounded-t-lg mx-auto opacity-20 transition-opacity group-hover:opacity-100 group-hover:bg-yellow2 px-[5px] rounded group-hover:shadow-yellow1 group-hover:bg-opacity-90	" src={githubLogo} alt="" />
                        </a>
                    </div>
                </a>

                

            </div>
        </section>
    );
}

export default Community;