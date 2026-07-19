"use client";

import { useState } from "react";

import HeaderClient from "@/components/HeaderClient";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";


export default function HomeClient(){

const [search,setSearch]=useState("");



return (

<>

<HeaderClient

search={search}

setSearch={setSearch}

user={null}

/>


<Hero />


<ProductList />


</>

)

}