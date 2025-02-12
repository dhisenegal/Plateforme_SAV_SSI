"use client";

import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "@/actions/login";
import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
          if (data.success) {
            router.push(data.redirectTo);
          }
        }
      });
    });
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/auth-bg.jpg')",
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg mx-auto"
      >
        <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <Image
                src="/logo.jpg"
                alt="DHI Logo"
                width={100}
                height={90}
                priority
                className="object-contain"
              />
            </motion.div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur DHI</h1>
              <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
            </div>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <motion.div
                  className="space-y-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-2">
                          <FiMail className="text-gray-500" />
                          <span>Login</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="votre login"
                            type="text"
                            disabled={isPending}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white/90"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-2">
                          <FiLock className="text-gray-500" />
                          <span>Mot de passe</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="*******"
                            type="password"
                            disabled={isPending}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white/90"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {success && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-500 text-center"
                  >
                    {success}
                  </motion.p>
                )}

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                    disabled={isPending}
                  >
                    {isPending ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};