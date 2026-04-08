"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    pageBg:
      "radial-gradient(circle at top, rgba(183, 110, 121, 0.16), transparent 30%), linear-gradient(135deg, #f8f1f2 0%, #f4ebed 45%, #efe3e6 100%)",
    cardBg: "rgba(255, 248, 248, 0.9)",
    cardBorder: "1px solid rgba(183, 110, 121, 0.18)",
    title: "#4A3A3D",
    text: "#5F4A4E",
    muted: "#8A7277",
    accent: "#B76E79",
    accentDark: "#9E5C66",
    accentSoft: "rgba(183, 110, 121, 0.10)",
    line: "#E8D7DA",
    white: "#FFF8F8",
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMessage("Регистрация прошла! Теперь вы можете войти.");
    } catch (error: any) {
      setMessage(error.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage("Вход выполнен!");
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(error.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        background: colors.pageBg,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "440px",
          background: colors.cardBg,
          backdropFilter: "blur(10px)",
          borderRadius: "28px",
          padding: "36px 32px",
          border: colors.cardBorder,
          boxShadow:
            "0 20px 60px rgba(97, 70, 76, 0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(183,110,121,0.18) 0%, rgba(255,255,255,0.92) 100%)",
              border: `1px solid ${colors.line}`,
              color: colors.accentDark,
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            ✦
          </div>

          <p
            style={{
              margin: 0,
              color: colors.accent,
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Hair CRM
          </p>

          <h1
            style={{
              margin: "14px 0 12px",
              fontSize: "34px",
              lineHeight: 1.08,
              fontWeight: 600,
              color: colors.title,
              letterSpacing: "-0.03em",
            }}
          >
            Эстетичный контроль
            <br />
            салона в одном месте
          </h1>

          <p
            style={{
              margin: 0,
              color: colors.text,
              fontSize: "15px",
              lineHeight: 1.65,
              maxWidth: "340px",
            }}
          >
            Управляй записями, клиентами и услугами в спокойном, современном
            интерфейсе.
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <label
            htmlFor="email"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            style={{
              height: "54px",
              padding: "0 16px",
              borderRadius: "16px",
              border: `1px solid ${colors.line}`,
              background: colors.white,
              color: colors.title,
              fontSize: "15px",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(97, 70, 76, 0.04)",
            }}
          />

          <label
            htmlFor="password"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Пароль
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
            style={{
              height: "54px",
              padding: "0 16px",
              borderRadius: "16px",
              border: `1px solid ${colors.line}`,
              background: colors.white,
              color: colors.title,
              fontSize: "15px",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(97, 70, 76, 0.04)",
            }}
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              style={{
                flex: 1,
                height: "54px",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                color: colors.white,
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                background: loading
                  ? "linear-gradient(135deg, #d2b0b8 0%, #be909a 100%)"
                  : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                boxShadow: "0 16px 32px rgba(158, 92, 102, 0.22)",
              }}
            >
              {loading ? "Подготовка..." : "Зарегистрироваться"}
            </button>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              style={{
                flex: 1,
                height: "54px",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                color: colors.white,
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                background: loading
                  ? "linear-gradient(135deg, #d2b0b8 0%, #be909a 100%)"
                  : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                boxShadow: "0 16px 32px rgba(158, 92, 102, 0.22)",
              }}
            >
              {loading ? "Подготовка..." : "Войти"}
            </button>
          </div>

          {message && (
            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                padding: "14px 16px",
                borderRadius: "16px",
                background: colors.accentSoft,
                border: `1px solid ${colors.line}`,
                color: colors.accentDark,
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
