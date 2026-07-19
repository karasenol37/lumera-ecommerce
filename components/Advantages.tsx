const advantages = [
  {
    icon: "🚚",
    title: "Hızlı Kargo",
    text: "Güvenli ve hızlı teslimat",
  },
  {
    icon: "🔒",
    title: "Güvenli Ödeme",
    text: "256 bit SSL korumalı ödeme",
  },
  {
    icon: "↩️",
    title: "Kolay İade",
    text: "14 gün içinde kolay iade",
  },
  {
    icon: "☎️",
    title: "Müşteri Desteği",
    text: "7/24 destek hizmeti",
  },
];


export default function Advantages() {
  return (
    <section className="bg-gray-100 py-12">

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-4">

        {advantages.map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white p-6 text-center shadow"
          >

            <div className="text-4xl">
              {item.icon}
            </div>

            <h3 className="mt-4 font-bold">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {item.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}