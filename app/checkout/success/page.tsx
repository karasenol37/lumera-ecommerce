import Link from "next/link";

export default function CheckoutSuccessPage() {

  return (

    <main
      className="
      min-h-screen
      bg-[#111]
      px-6
      py-20
      text-white
      "
    >

      <div
        className="
        mx-auto
        max-w-xl
        rounded-2xl
        bg-[#181818]
        p-10
        text-center
        "
      >

        <div className="text-6xl">
          ✓
        </div>


        <h1
          className="
          mt-6
          text-4xl
          font-bold
          "
        >
          Siparişiniz Alındı
        </h1>


        <p
          className="
          mt-4
          text-gray-400
          "
        >
          LUMERA alışverişiniz için teşekkür ederiz.
          Siparişiniz hazırlanmak üzere sisteme kaydedildi.
        </p>


        <Link
          href="/"
          className="
          mt-8
          inline-block
          rounded-full
          bg-[#c8a165]
          px-8
          py-4
          font-bold
          text-black
          "
        >
          Alışverişe Devam Et
        </Link>


      </div>

    </main>

  );

}