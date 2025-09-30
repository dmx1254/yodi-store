"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader,
  Mail,
  Phone,
  MapPin,
  Landmark,
  PackageCheck,
  PackageX,
  PackageSearch,
  CreditCard,
  LoaderCircle,
  ShoppingCart,
  Settings2,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { covertDate, OrderR, UserR } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const [user, setUser] = useState<UserR | null>(null);
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalSpent: number;
    delivered: number;
    pending: number;
    cancelled: number;
    processing: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastOrder, setLastOrder] = useState<OrderR | null>(null);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<UserR | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, statsRes, lastOrderRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/order/getstats"),
          fetch("/api/order/last"),
        ]);
        if (userRes.status === 401) {
          toast.error("Vous devez être connecté pour accéder à votre profil.");
          router.push("/connexion");
          return;
        }
        if (!userRes.ok || !statsRes.ok) throw new Error();
        setUser(await userRes.json());
        setStats(await statsRes.json());
        if (lastOrderRes.ok) setLastOrder(await lastOrderRes.json());
      } catch {
        toast.error("Erreur lors de la récupération du profil ou des stats");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader className="animate-spin text-[#FFCD00]" size={40} />
      </div>
    );
  }

  if (!user) return null;

  // Calcul du total dépensé uniquement sur les commandes livrées
  const totalSpentDelivered =
    stats?.totalSpent && stats?.delivered
      ? stats.totalSpent * (stats.delivered / (stats.totalOrders || 1))
      : 0;

  // Initiales pour l'avatar
  const initials =
    `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Compte supprimé avec succès", {
        duration: 3000,
        style: {
          color: "#10b981",
        },
        position: "top-right",
      });
      await signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center gap-8 p-4">
      {/* Infos utilisateur */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6 mb-8 md:mb-0 border border-gray-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl md:text-3xl font-bold text-gray-400 border border-gray-200">
            {initials}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-black/90">
              {user.firstname} {user.lastname}
            </div>
            <div className="text-sm text-gray-400 capitalize">
              {user.country}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Mail size={16} /> Email
            </span>
            <span className="font-medium text-black/80 break-all">
              {user.email}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Phone size={16} /> Téléphone
            </span>
            <span className="font-medium text-black/80">{user.phone}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={16} /> Adresse
            </span>
            <span className="font-medium text-black/80">
              {user.address || (
                <span className="text-gray-300">Non renseignée</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Landmark size={16} /> Ville / Région
            </span>
            <span className="font-medium text-black/80">
              {user.city || (
                <span className="text-gray-300">Non renseignée</span>
              )}{" "}
              {user.country && <span>- {user.country}</span>}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <CreditCard size={16} /> Code postal
            </span>
            <span className="font-medium text-black/80">
              {user.zip || <span className="text-gray-300">Non renseigné</span>}
            </span>
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 rounded bg-[#FFCD00] text-black font-semibold hover:bg-black hover:text-[#FFCD00] transition-colors w-fit"
          onClick={() => {
            setEditData(user);
            setEditOpen(true);
            setEditError(null);
            setEditSuccess(null);
            setPasswords({ old: "", new: "", confirm: "" });
          }}
        >
          Modifier
        </button>
      </div>
      {/* Stats commandes */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-black/80 mb-2">
          Mes statistiques de commandes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100">
            <PackageSearch size={28} className="text-gray-300 mb-1" />
            <div className="text-2xl font-bold text-black/80">
              {stats?.totalOrders ?? 0}
            </div>
            <div className="text-xs text-gray-400">Commandes totales</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100">
            <PackageCheck size={28} className="text-green-400 mb-1" />
            <div className="text-2xl font-bold text-black/80">
              {stats?.delivered ?? 0}
            </div>
            <div className="text-xs text-gray-400">Commandes livrées</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100">
            <Loader size={28} className="text-yellow-300 mb-1" />
            <div className="text-2xl font-bold text-black/80">
              {stats?.pending ?? 0}
            </div>
            <div className="text-xs text-gray-400">En attente</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100">
            <LoaderCircle size={28} className="text-blue-300 mb-1" />
            <div className="text-2xl font-bold text-black/80">
              {stats?.processing ?? 0}
            </div>
            <div className="text-xs text-gray-400">En cours de traitement</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100">
            <PackageX size={28} className="text-red-300 mb-1" />
            <div className="text-2xl font-bold text-black/80">
              {stats?.cancelled ?? 0}
            </div>
            <div className="text-xs text-gray-400">Commandes annulées</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center gap-2 border border-gray-100 mt-4">
          <CreditCard size={28} className="text-[#FFCD00] mb-1" />
          <div className="text-2xl font-bold text-black/80">
            {stats?.delivered && stats?.totalSpent
              ? (
                  stats.totalSpent *
                  (stats.delivered / (stats.totalOrders || 1))
                ).toLocaleString() + " FCFA"
              : "0 FCFA"}
          </div>
          <div className="text-xs text-gray-400">Total dépensé (livrées)</div>
        </div>
      </div>
      {/* Tracking dernière commande */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 mt-8">
        <h2 className="text-lg font-semibold text-black/80 mb-2">
          Suivi de ma dernière commande
        </h2>
        {lastOrder ? (
          <div className="flex flex-col gap-2">
            <StepperOrder status={lastOrder.status} />
            <div className="text-sm text-gray-500 mt-2">
              Statut actuel :{" "}
              <span className="font-semibold text-black/80">
                {getStatusLabel(lastOrder.status)}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Commande passée le {covertDate(lastOrder.createdAt)}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            Aucune commande récente à afficher.
          </div>
        )}
      </div>
      {/* Modal d'édition du profil */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg p-6 rounded-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setEditLoading(true);
              setEditError(null);
              setEditSuccess(null);
              // Validation mot de passe
              if (passwords.new || passwords.confirm || passwords.old) {
                if (!passwords.old || !passwords.new || !passwords.confirm) {
                  setEditError("Tous les champs de mot de passe sont requis.");
                  setEditLoading(false);
                  return;
                }
                if (passwords.new !== passwords.confirm) {
                  setEditError(
                    "Les nouveaux mots de passe ne correspondent pas."
                  );
                  setEditLoading(false);
                  return;
                }
                if (passwords.new.length < 6) {
                  setEditError(
                    "Le nouveau mot de passe doit contenir au moins 6 caractères."
                  );
                  setEditLoading(false);
                  return;
                }
              }
              // Préparation des données
              const payload: any = {
                firstname: editData?.firstname,
                lastname: editData?.lastname,
                phone: editData?.phone,
                address: editData?.address,
                city: editData?.city,
                country: editData?.country,
                zip: editData?.zip,
              };
              if (passwords.old && passwords.new) {
                payload.oldPassword = passwords.old;
                payload.newPassword = passwords.new;
              }
              try {
                const res = await fetch("/api/user/update", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok)
                  throw new Error(
                    data.error || "Erreur lors de la mise à jour"
                  );
                setEditSuccess("Profil mis à jour avec succès !");
                setTimeout(() => setEditOpen(false), 1200);
                // Rafraîchir les infos profil
                setUser((u) => u && { ...u, ...payload });
                setPasswords({ old: "", new: "", confirm: "" });
              } catch (err: any) {
                setEditError(err.message);
              } finally {
                setEditLoading(false);
              }
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Prénom</label>
                <input
                  type="text"
                  value={editData?.firstname || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, firstname: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Nom</label>
                <input
                  type="text"
                  value={editData?.lastname || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, lastname: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Téléphone</label>
                <input
                  type="text"
                  value={editData?.phone || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Adresse</label>
                <input
                  type="text"
                  value={editData?.address || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Ville</label>
                <input
                  type="text"
                  value={editData?.city || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Région</label>
                <input
                  type="text"
                  value={editData?.country || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Code postal</label>
                <input
                  type="text"
                  value={editData?.zip || ""}
                  onChange={(e) =>
                    setEditData((d) => d && { ...d, zip: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                />
              </div>
            </div>
            <div className="border-t pt-4 mt-2">
              <div className="font-semibold text-black/80 mb-2">
                Changer le mot de passe
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">
                    Ancien mot de passe
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.old}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, old: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    Nouveau mot de passe
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, new: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Confirmer</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, confirm: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFCD00]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="showpass"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label
                  htmlFor="showpass"
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  Afficher les mots de passe
                </label>
              </div>
            </div>
            {editError && (
              <div className="text-red-500 text-sm mt-2">{editError}</div>
            )}
            {editSuccess && (
              <div className="text-green-600 text-sm mt-2">{editSuccess}</div>
            )}
            <DialogFooter>
              <button
                type="submit"
                className="bg-[#FFCD00] text-black px-6 py-2 rounded font-semibold hover:bg-black hover:text-[#FFCD00] transition-colors"
                disabled={editLoading}
              >
                {editLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  className="ml-2 px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </DialogClose>
            </DialogFooter>
          </form>
          <button
            className="mt-6 px-6 py-2 rounded bg-red-600 text-white font-semibold cursor-pointer hover:opacity-75"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Suppression..." : "Supprimer mon compte"}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepperOrder({ status }: { status: string }) {
  const steps = [
    {
      key: "processing",
      label: "Traitement",
      icon: Settings2,
      color: "#3B82F6",
    },
    { key: "pending", label: "En attente", icon: Clock3, color: "#F59E42" },
    { key: "delivered", label: "Livrée", icon: CheckCircle2, color: "#22C55E" },
    { key: "cancelled", label: "Annulée", icon: XCircle, color: "#EF4444" },
  ];
  const statusIndex = steps.findIndex(
    (s) =>
      status === s.key ||
      (status === "pending" && s.key === "pending") ||
      (status === "processing" && s.key === "processing") ||
      (status === "delivered" && s.key === "delivered") ||
      (status === "cancelled" && s.key === "cancelled")
  );
  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx < statusIndex || idx === statusIndex;
        const color = isActive ? step.color : "#E5E7EB"; // gris clair si non atteint
        const iconColor = isActive ? "white" : "#A3A3A3";
        return (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border transition-all"
              style={{
                backgroundColor: isActive ? color : "#F3F4F6",
                borderColor: isActive ? color : "#E5E7EB",
                color: iconColor,
              }}
            >
              <Icon size={22} color={iconColor} />
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

function getStatusLabel(status: string) {
  switch (status) {
    case "processing":
      return "En cours de traitement";
    case "pending":
      return "En attente";
    case "delivered":
      return "Livrée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
}
