"use client";

import { useState } from "react";
import HeaderClient from "./HeaderClient";


type Props = {
 user:any;
};


export default function HeaderState({
user
}:Props){


const [search,setSearch]=useState("");


return (

<HeaderClient

search={search}

setSearch={setSearch}

user={user}

/>

);

}