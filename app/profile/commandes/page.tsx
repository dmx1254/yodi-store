"use client";

import { useEffect, useState } from "react";
import {
  Loader,
  PackageCheck,
  PackageX,
  LoaderCircle,
  Clock3,
  ShoppingCart,
  CreditCard,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { covertDate, OrderR } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CART } from "@/lib/types/types";

const statusMap = {
  delivered: {
    label: "Livrée",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: PackageCheck,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: Clock3,
  },
  processing: {
    label: "Traitement",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: LoaderCircle,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: PackageX,
  },
  created: {
    label: "Créée",
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: ShoppingCart,
  },
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<OrderR[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderR | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order/get-orders");
        if (!res.ok) throw new Error();
        setOrders(await res.json());
      } catch {
        toast.error("Erreur lors de la récupération des commandes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // console.log(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-50 pb-8">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-gray-50 shadow-sm py-4 mb-8">
        <h1 className="text-3xl font-extrabold text-black/90 text-center tracking-tight">
          Mes commandes
        </h1>
      </header>
      <div className="flex flex-col items-center px-2">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader className="animate-spin text-[#FFCD00]" size={32} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-gray-400 text-center mt-12">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {orders.map((order) => {
              const status =
                statusMap[order.status as keyof typeof statusMap] ||
                statusMap.created;
              return (
                <div
                  key={order._id}
                  className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl group overflow-hidden"
                  style={{
                    minHeight: 260,
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                  }}
                >
                  {/* Watermark icon */}
                  <ShoppingCart
                    className="absolute right-4 bottom-4 text-gray-100 opacity-30 text-[80px] pointer-events-none select-none hidden md:block"
                    size={80}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${status.color} shadow-sm`}
                    >
                      <span className="flex items-center justify-center w-4 h-4">
                        <status.icon size={16} />
                      </span>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {covertDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      {(order.products as CART[])
                        .slice(0, 3)
                        .map((prod, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1 shadow-sm"
                          >
                            {prod.imageUrl && (
                              <Image
                                src={prod.imageUrl}
                                alt={prod.title}
                                width={32}
                                height={32}
                                className="rounded object-cover w-8 h-8"
                              />
                            )}
                            <span className="text-xs font-medium text-black/80 line-clamp-1">
                              {prod.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              x{prod.quantity}
                            </span>
                          </div>
                        ))}
                      {order.products.length > 3 && (
                        <span className="text-xs text-gray-400 ml-2">
                          +{order.products.length - 3} autres
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Commande n°{" "}
                        <span className="font-semibold text-black/80">
                          {order._id.slice(-6).toUpperCase()}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Total :{" "}
                        <span className="font-semibold text-black/80">
                          {order.total.toLocaleString()}{" "}
                          {order.selectedCurrency}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Articles :{" "}
                        <span className="font-semibold text-black/80">
                          {order.products.length}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CreditCard size={14} className="text-[#FFCD00]" />
                      <span className="font-medium">Paiement :</span>
                      <span className="font-semibold text-black/70">
                        {order.paymentMethod === "on-delivery"
                          ? "Paiement à la livraison"
                          : order.paymentMethod || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">Livraison :</span>
                      <span className="font-semibold text-black/70">
                        {Number(
                          order.shippingCost / order.valueCurrency
                        ).toFixed(2) || "-"}{" "}
                        {order.selectedCurrency}
                      </span>
                    </div>
                    {order.shippingInfo?.address && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="font-medium">Adresse :</span>
                        <span className="line-clamp-1">
                          {order.shippingInfo.address}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">Zone de livraison :</span>
                      <span className="font-semibold text-black/70">
                        {order.shippingInfo.delivery}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-3 px-4 py-2 cursor-pointer rounded-lg bg-[#FFCD00] text-black font-semibold shadow hover:bg-black hover:text-[#FFCD00] transition-colors text-xs w-fit self-end"
                    onClick={() => {
                      setSelectedOrder(order);
                      setOpenDetail(true);
                    }}
                  >
                    Voir le détail
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Dialog détail commande */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto scrollbar-hide">
          {selectedOrder &&
            (() => {
              const status =
                statusMap[selectedOrder.status as keyof typeof statusMap];
              const StatusIcon = status.icon;
              return (
                <div className="bg-white/90 backdrop-blur-xl p-6 md:p-10 flex flex-col gap-6 relative">
                  <DialogHeader className="flex flex-row items-center justify-between mb-2">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${status.color} shadow-sm`}
                      >
                        <span className="flex items-center justify-center w-4 h-4">
                          <StatusIcon size={16} />
                        </span>
                        {status.label}
                      </span>
                      <span className="text-gray-400 font-mono text-xs ml-2">
                        {covertDate(selectedOrder.createdAt)}
                      </span>
                    </DialogTitle>
                  </DialogHeader>
                  {/* Timeline/étapes */}
                  <StepperOrder status={selectedOrder.status} />
                  {/* Liste produits */}
                  <div className="flex flex-col gap-3">
                    <div className="font-semibold text-black/80 mb-1">
                      Produits commandés
                    </div>
                    <div className="flex flex-col gap-2">
                      {(selectedOrder.products as CART[]).map((prod, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 shadow-sm"
                        >
                          {prod.imageUrl && (
                            <Image
                              src={prod.imageUrl}
                              alt={prod.title}
                              width={40}
                              height={40}
                              className="rounded object-cover w-10 h-10"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-black/90 text-sm line-clamp-1">
                              {prod.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              x{prod.quantity}
                            </div>

                            {prod.brand && (
                              <div className="text-xs text-gray-500">
                                Marque : {prod.brand}
                              </div>
                            )}
                            {prod.category && (
                              <div className="text-xs text-gray-500">
                                Catégorie : {prod.category}
                              </div>
                            )}
                            {prod.etiquette && (
                              <div className="text-xs text-gray-500">
                                Etiquette : {prod.etiquette}
                              </div>
                            )}
                            {prod.sku && (
                              <div className="text-xs text-gray-500">
                                Sku : {prod.sku}
                              </div>
                            )}
                          </div>
                          {prod.price && prod.discount && prod.discount > 0 && (
                            <div className="text-xs text-black/80 font-semibold">
                              {prod.discount && prod.discount > 0 && (
                                <span className="ml-2">
                                  {Number(
                                    (prod.price -
                                      (prod.price * prod.discount) / 100) /
                                      Number(selectedOrder.valueCurrency)
                                  ).toFixed(2)}{" "}
                                  {selectedOrder.selectedCurrency === "XOF"
                                    ? "FCFA"
                                    : "USD"}
                                </span>
                              )}
                              {!prod.discount && prod.price > 0 && (
                                <span>
                                  {Number(
                                    prod.price / selectedOrder.valueCurrency
                                  ).toFixed(2)}{" "}
                                  {selectedOrder.selectedCurrency === "XOF"
                                    ? "FCFA"
                                    : "USD"}
                                </span>
                              )}
                            </div>
                          )}
                          {prod.price && prod.discount && prod.discount > 0 && (
                            <div className="text-xs text-gray-400 font-semibold ml-2">
                              {(
                                Number(
                                  (prod.price -
                                    (prod.price * prod.discount) / 100) *
                                    prod.quantity
                                ) / Number(selectedOrder.valueCurrency)
                              ).toFixed(2)}{" "}
                              {selectedOrder.selectedCurrency}
                            </div>
                          )}
                          {prod.price && !prod.discount && (
                            <div className="text-xs text-gray-400 font-semibold ml-2">
                              {Number(
                                (prod.price * prod.quantity) /
                                  Number(selectedOrder.valueCurrency)
                              ).toFixed(2)}{" "}
                              {selectedOrder.selectedCurrency}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Récapitulatif */}
                  <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 mt-2">
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="text-xs text-gray-500">
                        Commande n°{" "}
                        <span className="font-semibold text-black/80">
                          {selectedOrder._id.slice(-6).toUpperCase()}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Total :{" "}
                        <span className="font-semibold text-black/80">
                          {selectedOrder.total.toLocaleString()}{" "}
                          {selectedOrder.selectedCurrency}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Articles :{" "}
                        <span className="font-semibold text-black/80">
                          {selectedOrder.products.length}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <CreditCard size={14} className="text-[#FFCD00]" />{" "}
                        <span className="font-medium">Paiement :</span>{" "}
                        <span className="font-semibold text-black/70">
                          {selectedOrder.paymentMethod === "on-delivery"
                            ? "Paiement à la livraison"
                            : selectedOrder.paymentMethod || "-"}
                        </span>
                        <span className="font-semibold text-black/70">
                          Zone de livraison :{" "}
                          {selectedOrder.shippingInfo.delivery}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">Livraison :</span>{" "}
                        <span className="font-semibold text-black/70">
                          {Number(
                            selectedOrder.shippingCost /
                              selectedOrder.valueCurrency
                          ).toFixed(2) || "-"}{" "}
                          {selectedOrder.selectedCurrency}
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* Bloc adresse de livraison complet */}
                  {selectedOrder.shippingInfo && (
                    <div className="flex flex-col gap-1 bg-white/80 rounded-xl p-4 mt-3 border border-gray-100">
                      <div className="font-semibold text-black/80 mb-1 flex items-center gap-2">
                        <MapPin size={16} className="text-[#FFCD00]" /> Adresse
                        de livraison
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-gray-700">
                        {selectedOrder.shippingInfo.lastname &&
                          selectedOrder.shippingInfo.firstname && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Nom :</span>{" "}
                              <span>
                                {selectedOrder.shippingInfo.lastname}{" "}
                                {selectedOrder.shippingInfo.firstname}
                              </span>
                            </div>
                          )}
                        {selectedOrder.shippingInfo.address && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Adresse :</span>{" "}
                            <span>{selectedOrder.shippingInfo.address}</span>
                          </div>
                        )}
                        {selectedOrder.shippingInfo.city && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Ville :</span>{" "}
                            <span>{selectedOrder.shippingInfo.city}</span>
                          </div>
                        )}
                        {selectedOrder.shippingInfo.phone && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Téléphone :</span>{" "}
                            <span>{selectedOrder.shippingInfo.phone}</span>
                          </div>
                        )}
                        {selectedOrder.shippingInfo.postalCode && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Code postal :</span>{" "}
                            <span>{selectedOrder.shippingInfo.postalCode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Timeline/étapes de la commande
function StepperOrder({ status }: { status: string }) {
  const steps = [
    {
      key: "created",
      label: "Commande passée",
      icon: ShoppingCart,
      color: "#FFCD00",
    },
    {
      key: "processing",
      label: "Traitement",
      icon: LoaderCircle,
      color: "#3B82F6",
    },
    { key: "pending", label: "En attente", icon: Clock3, color: "#F59E42" },
    { key: "delivered", label: "Livrée", icon: PackageCheck, color: "#22C55E" },
    { key: "cancelled", label: "Annulée", icon: PackageX, color: "#EF4444" },
  ];
  const statusIndex = steps.findIndex((s) => status === s.key);
  return (
    <div className="flex items-center gap-2 w-full mb-2">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx < statusIndex || idx === statusIndex;
        const color = isActive ? step.color : "#E5E7EB";
        const iconColor = isActive ? "white" : "#A3A3A3";
        return (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border transition-all"
              style={{
                backgroundColor: isActive ? color : "#F3F4F6",
                borderColor: isActive ? color : "#E5E7EB",
                color: iconColor,
              }}
            >
              <Icon size={18} color={iconColor} />
            </div>
            {idx < steps.length - 1 && (
              <div
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: idx < statusIndex ? color : "#E5E7EB",
                }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
