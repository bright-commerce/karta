"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        // Fetch the session to check their role
        const session = await getSession();
        
        if (session?.user?.role === "ADMIN") {
          const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
          if (adminUrl) {
            window.location.href = `${adminUrl.replace(/\/$/, '')}/admin`;
          } else {
            router.push("/admin");
          }
        } else if (session?.user?.role === "SELLER") {
          const sellerUrl = process.env.NEXT_PUBLIC_SELLER_URL;
          if (sellerUrl) {
            window.location.href = `${sellerUrl.replace(/\/$/, '')}/seller`;
          } else {
            router.push("/seller");
          }
        } else {
          // BUYER role or unknown, redirect to storefront homepage
          router.push("/");
        }
        
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Background gradients for premium feel */}
      <div className={styles.bgGradient1} />
      <div className={styles.bgGradient2} />

      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>
            Welcome Back
          </h1>
          <p className={styles.loginSubtitle}>Sign in to access the Karta admin dashboard.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              placeholder="admin@karta.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
