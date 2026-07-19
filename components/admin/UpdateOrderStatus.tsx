"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/order";
import { useRouter } from "next/navigation";



type Props = {

  orderId:number;

  currentStatus:string;

};







export default function UpdateOrderStatus({

  orderId,

  currentStatus,

}:Props){



  const router = useRouter();



  const [status,setStatus] = useState(
    currentStatus
  );


  const [loading,setLoading] = useState(false);


  const [message,setMessage] = useState("");









async function handleUpdate(){



  if(
    status === "İptal"
    &&
    currentStatus !== "İptal"
  ){


    const confirmCancel = confirm(

      "Bu sipariş iptal edilecek ve ürün stokları geri eklenecek. Emin misiniz?"

    );



    if(!confirmCancel){

      setStatus(currentStatus);

      return;

    }


  }







  try{


    setLoading(true);

    setMessage("");




    await updateOrderStatus({


      orderId,

      status,


    });





    setMessage(
      "Sipariş durumu güncellendi."
    );



    router.refresh();





  }

  catch(error){


    console.error(error);



    setMessage(

      "Durum güncellenirken hata oluştu."

    );



  }

  finally{


    setLoading(false);


  }




}









return (

<div className="
mt-6
flex
flex-col
gap-4
sm:flex-row
sm:items-center
">







<select

value={status}

onChange={(e)=>

setStatus(e.target.value)

}

className="
rounded-xl
bg-[#222]
px-5
py-3
text-white
outline-none
"

>



<option value="Bekliyor">

Bekliyor

</option>



<option value="Hazırlanıyor">

Hazırlanıyor

</option>




<option value="Kargoda">

Kargoda

</option>




<option value="Teslim Edildi">

Teslim Edildi

</option>




<option value="İptal">

İptal

</option>



</select>









<button

onClick={handleUpdate}

disabled={loading}

className="
rounded-full
bg-[#c8a165]
px-8
py-3
font-bold
text-black
disabled:opacity-50
"

>

{

loading

?

"Güncelleniyor..."

:

"Durumu Güncelle"

}



</button>










{
message && (

<p className={`
text-sm
font-semibold

${
message.includes("hata")
?
"text-red-400"
:
"text-green-400"
}

`}>

{message}

</p>

)

}









</div>

);


}