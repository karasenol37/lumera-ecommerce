"use client";

import { useState } from "react";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";


export default function HomeClient(){

const [search,setSearch]=useState("");



return (

<>

<Header
search={search}
setSearch={setSearch}
/>


<Hero />


<ProductList />


</>

)

}