"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Регистрация
  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Регистрация прошла! Теперь вы можете войти.");
      // Не переходим сразу на дашборд, чтобы дать пользователю войти
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Вход
  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Вход выполнен!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      setMessage(error.message);
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
        background:
          "radial-gradient(circle at top, rgba(201, 168, 120, 0.16), transparent 30%), linear-gradient(135deg, #f8f3ee 0%, #f4ede6 45%, #efe6dc 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255, 252, 248, 0.88)",
          backdropFilter: "blur(10px)",
          borderRadius: "28px",
          padding: "36px 32px",
          border: "1px solid rgba(191, 161, 120, 0.22)",
          boxShadow:
            "0 20px 60px rgba(86, 66, 45, 0.10), inset 0 1px 0 rgba(255,255,255,0.65)",
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
                "linear-gradient(135deg, rgba(201,168,120,0.22) 0%, rgba(255,255,255,0.9) 100%)",
              border: "1px solid rgba(191, 161, 120, 0.24)",
              color: "#8c6a43",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            ✦
          </div>

          <p
            style={{
              margin: 0,
              color: "#9a7b55",
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
              color: "#2f241a",
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
              color: "#6f6255",
              fontSize: "15px",
              lineHeight: 1.65,
              maxWidth: "340px",
            }}
          >
            Управляй записями, клиентами и услугами в спокойном, современном
            интерфейсе.
          </p>
        </div>

        {/* Форма для email и пароля — общая */}
        <form style={{ display: "grid", gap: "14px" }}>
          <label
            htmlFor="email"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#5f5143",
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
              border: "1px solid rgba(176, 149, 115, 0.25)",
              background: "rgba(255,255,255,0.72)",
              color: "#2f241a",
              fontSize: "15px",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(84, 61, 38, 0.04)",
            }}
          />

          <label
            htmlFor="password"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#5f5143",
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
              border: "1px solid rgba(176, 149, 115, 0.25)",
              background: "rgba(255,255,255,0.72)",
              color: "#2f241a",
              fontSize: "15px",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(84, 61, 38, 0.04)",
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
                color: "#fffaf4",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                background: loading
                  ? "linear-gradient(135deg, #c9b18f 0%, #b89b76 100%)"
                  : "linear-gradient(135deg, #b9966b 0%, #8e6a46 100%)",
                boxShadow: "0 16px 32px rgba(142, 106, 70, 0.22)",
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
                color: "#fffaf4",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                background: loading
                  ? "linear-gradient(135deg, #c9b18f 0%, #b89b76 100%)"
                  : "linear-gradient(135deg, #b9966b 0%, #8e6a46 100%)",
                boxShadow: "0 16px 32px rgba(142, 106, 70, 0.22)",
              }}
            >
              {loading ? "Подготовка..." : "Войти"}
            </button>
          </div>
        </form>

        {message && (
          <p
            style={{
              marginTop: "18px",
              marginBottom: 0,
              padding: "14px 16px",
              borderRadius: "16px",
              background: "rgba(191, 161, 120, 0.10)",
              border: "1px solid rgba(191, 161, 120, 0.18)",
              color: "#6c5438",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}