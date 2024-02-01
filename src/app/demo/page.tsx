import React  from "react";
import Chat from "./chat";
// import { unstable_setRequestLocale } from "next-intl/server";
export default async function Index() { 
    // unstable_setRequestLocale(locale);
  return  <div className='mx-auto'>
  <Chat />
</div>
}