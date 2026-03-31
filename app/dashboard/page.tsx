"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  birthday: string | null;
};

export default function DashboardPage() {
  const [clientCount, setClientCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [todayBirthdays, setTodayBirthdays] = useState<Client[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Количество клиентов
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });
      setClientCount(clientsCount || 0);

      // Количество заметок
      const { count: notesCount } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true });
      setNoteCount(notesCount || 0);

      // Именинники сегодня или завтра
      const today = new Date().toISOString().slice(5, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(5, 10);

      const { data: clients } = await supabase
        .from("clients")
        .select("id, name, birthday")
        .not("birthday", "is", null);

      if (clients) {
        const birthdays = clients.filter((client) => {
          const bday = client.birthday!.slice(5);
          return bday === today || bday === tomorrow;
        });
        setTodayBirthdays(birthdays);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      title: "Клиенты",
      description: "Список клиентов салона и история взаимодействий.",
      value: clientCount.toString(),
      link: "/dashboard/clients",
    },
    {
      title: "Добавить клиента",
      description: "Быстрое создание новой карточки клиента.",
      value: "+1",
      link: "/dashboard/clients",
    },
    {
      title: "Заметки",
      description: "Личные рабочие заметки и важные детали.",
      value: noteCount.toString(),
      link: "/dashboard/clients",
    },
    {
      title: "Статистика",
      description: "Краткий обзор состояния салона за день.",
      value: "—",
      link: "/dashboard/clients",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(201, 168, 120, 0.16), transparent 30%), linear-gradient(135deg, #f8f3ee 0%, #f4ede6 45%, #efe6dc 100%)",
        padding: "32px 20px 48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div>
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
                margin: "12px 0 10px",
                fontSize: "36px",
                lineHeight: 1.08,
                fontWeight: 600,
                color: "#2f241a",
                letterSpacing: "-0.03em",
              }}
            >
              Панель управления
            </h1>

            <p
              style={{
                margin: 0,
                color: "#6f6255",
                fontSize: "15px",
                lineHeight: 1.65,
                maxWidth: "560px",
              }}
            >
              Следи за клиентами, заметками и основными разделами CRM в одном
              аккуратном рабочем пространстве.
            </p>
          </div>

          <div
            style={{
              minWidth: "220px",
              background: "rgba(255, 252, 248, 0.88)",
              borderRadius: "24px",
              padding: "20px",
              border: "1px solid rgba(191, 161, 120, 0.22)",
              boxShadow: "0 20px 50px rgba(86, 66, 45, 0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#8a735a",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Сегодня
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "26px",
                fontWeight: 600,
                color: "#2f241a",
              }}
            >
              Спокойный день
            </p>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.link}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "rgba(255, 252, 248, 0.88)",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid rgba(191, 161, 120, 0.22)",
                  boxShadow:
                    "0 20px 50px rgba(86, 66, 45, 0.08), inset 0 1px 0 rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 24px 60px rgba(86, 66, 45, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px rgba(86, 66, 45, 0.08), inset 0 1px 0 rgba(255,255,255,0.65)";
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#9a7b55",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Раздел
                </p>

                <h2
                  style={{
                    margin: "14px 0 12px",
                    fontSize: "24px",
                    lineHeight: 1.2,
                    color: "#2f241a",
                    fontWeight: 600,
                  }}
                >
                  {card.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#6f6255",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    minHeight: "68px",
                  }}
                >
                  {card.description}
                </p>

                <div
                  style={{
                    marginTop: "18px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "56px",
                    height: "40px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    background: "rgba(191, 161, 120, 0.10)",
                    border: "1px solid rgba(191, 161, 120, 0.18)",
                    color: "#6c5438",
                    fontWeight: 700,
                  }}
                >
                  {card.value}
                </div>
              </article>
            </Link>
          ))}
        </section>

        {todayBirthdays.length > 0 && (
          <section
            style={{
              background: "rgba(255, 252, 248, 0.88)",
              borderRadius: "28px",
              padding: "28px",
              marginBottom: "28px",
              border: "1px solid rgba(191, 161, 120, 0.22)",
              boxShadow: "0 20px 50px rgba(86, 66, 45, 0.08)",
            }}
          >
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
              Поздравления
            </p>
            <h2
              style={{
                margin: "14px 0 12px",
                fontSize: "28px",
                color: "#2f241a",
                fontWeight: 600,
              }}
            >
              🎂 Именинники сегодня
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {todayBirthdays.map((client) => (
                <div
                  key={client.id}
                  style={{
                    background: "rgba(191, 161, 120, 0.10)",
                    padding: "12px 16px",
                    borderRadius: "16px",
                    color: "#6c5438",
                  }}
                >
                  {client.name}
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          style={{
            background: "rgba(255, 252, 248, 0.88)",
            borderRadius: "28px",
            padding: "28px",
            border: "1px solid rgba(191, 161, 120, 0.22)",
            boxShadow: "0 20px 50px rgba(86, 66, 45, 0.08)",
          }}
        >
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
            Обзор
          </p>

          <h2
            style={{
              margin: "14px 0 12px",
              fontSize: "28px",
              color: "#2f241a",
              fontWeight: 600,
            }}
          >
            Простая CRM уже собирается
          </h2>

          <p
            style={{
              margin: 0,
              color: "#6f6255",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "720px",
            }}
          >
            Сейчас это базовая версия панели управления. Следующим шагом мы
            добавим рабочий список клиентов, форму добавления клиента и раздел
            заметок, чтобы приложение стало ощущаться цельным.
          </p>
        </section>
      </div>
    </main>
  );
}