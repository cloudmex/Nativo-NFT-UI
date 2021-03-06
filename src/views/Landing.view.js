import React from "react";

//components
import Team from "../components/teamMembers.component";
import Hero from "../components/Hero.component";
import Steps from "../components/steps.component";
import NftSteps from "../components/NftSteps.component";
import Statisct from "../components/statistc.component";
import Trendings from "../components/Trendings.component";

export default function Landing() {
  const [Landing, setLanding] = React.useState({ theme: "yellow" });
  window.localStorage.setItem("page",0);
  window.localStorage.setItem("auctionpage",0);
  window.localStorage.setItem("tokenspage",30);
  return (
    <>
      <Hero />
      <NftSteps/>
      <Trendings/>
      <Statisct theme={Landing.theme} />
    </>
  );
}
