"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Key, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Demander le code, 2: Saisir le code + nouveau mot de passe
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2); // Passer à l'étape 2
        toast.success("Code de récupération envoyé !", {
          style: {
            color: "#10b981",
          },
          position: "top-right",
        });
      } else {
        toast.error(data.message || "Une erreur est survenue", {
          style: {
            color: "#ef4444",
          },
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Erreur de connexion. Veuillez réessayer.", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: formData.code,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Mot de passe réinitialisé avec succès !", {
          style: {
            color: "#10b981",
          },
          position: "top-right",
        });
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          router.push("/connexion");
        }, 2000);
      } else {
        toast.error(data.message || "Une erreur est survenue", {
          style: {
            color: "#ef4444",
          },
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Erreur de connexion. Veuillez réessayer.", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 w-full font-josefin">
      <div className="w-full flex flex-col items-center max-w-md mx-auto">
        
        <div className="w-full mb-8">
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#A36F5E] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à la connexion</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center">
            {step === 1 ? "Mot de passe oublié ?" : "Nouveau mot de passe"}
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            {step === 1 
              ? "Entrez votre email pour recevoir un code de récupération"
              : `Code envoyé à ${email}. Entrez le code et votre nouveau mot de passe`
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full">
          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#A36F5E] to-[#916253] text-white py-4 rounded-xl font-bold text-lg hover:from-[#916253] hover:to-[#A36F5E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Envoyer le code
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Vous vous souvenez de votre mot de passe ?{" "}
                  <Link href="/connexion" className="text-[#A36F5E] hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Code envoyé !</strong> Vérifiez votre boîte email et entrez le code à 6 chiffres reçu.
                </p>
              </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code de récupération *
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData(prev => ({ ...prev, code: value }));
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200 text-center text-xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Entrez le code à 6 chiffres reçu par email
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                  placeholder="Minimum 6 caractères"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#A36F5E] to-[#916253] text-white py-4 rounded-xl font-bold text-lg hover:from-[#916253] hover:to-[#A36F5E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Réinitialisation en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Réinitialiser le mot de passe
                </>
              )}
            </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Vous n&apos;avez pas reçu le code ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormData({ code: "", password: "", confirmPassword: "" });
                    }}
                    className="text-[#A36F5E] hover:underline font-medium"
                  >
                    Renvoyer le code
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
