"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  created_at?: string;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
  client_id?: string;
};

export default function ClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientBirthday, setNewClientBirthday] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [message, setMessage] = useState("");

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBirthday, setEditBirthday] = useState("");

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
    overlay: "rgba(74, 58, 61, 0.42)",
    dangerSoft: "#F5E7EA",
  };

  const loadClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Ошибка загрузки клиентов");
      console.error("loadClients error:", error);
    } else {
      setClients(data || []);
    }
  };

  const loadNotes = async (clientId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Ошибка загрузки заметок");
      console.error("loadNotes error:", error);
    } else {
      setNotes(data || []);
    }
  };

  const addClient = async () => {
    if (!newClientName.trim()) {
      setMessage("Введите имя клиента");
      return;
    }

    const { error } = await supabase.from("clients").insert([
      {
        name: newClientName.trim(),
        phone: newClientPhone.trim() || null,
        email: newClientEmail.trim() || null,
        birthday: newClientBirthday || null,
      },
    ]);

    if (error) {
      setMessage("Ошибка добавления клиента");
      console.error("addClient error:", error);
    } else {
      setMessage("Клиент добавлен!");
      setNewClientName("");
      setNewClientPhone("");
      setNewClientEmail("");
      setNewClientBirthday("");
      loadClients();
    }
  };

  const addNote = async () => {
    if (!selectedClient) {
      setMessage("Сначала выберите клиента");
      return;
    }

    if (!newNoteContent.trim()) {
      setMessage("Введите текст заметки");
      return;
    }

    const { error } = await supabase.from("notes").insert([
      {
        client_id: selectedClient.id,
        content: newNoteContent.trim(),
      },
    ]);

    if (error) {
      setMessage("Ошибка добавления заметки");
      console.error("addNote error:", error);
    } else {
      setMessage("Заметка добавлена!");
      setNewNoteContent("");
      loadNotes(selectedClient.id);
    }
  };

  const startEditClient = (client: Client) => {
    setEditingClient(client);
    setEditName(client.name);
    setEditPhone(client.phone || "");
    setEditEmail(client.email || "");
    setEditBirthday(client.birthday || "");
  };

  const updateClient = async () => {
    if (!editingClient) return;

    const { error } = await supabase
      .from("clients")
      .update({
        name: editName.trim(),
        phone: editPhone.trim() || null,
        email: editEmail.trim() || null,
        birthday: editBirthday || null,
      })
      .eq("id", editingClient.id);

    if (error) {
      setMessage("Ошибка обновления клиента");
      console.error("updateClient error:", error);
    } else {
      setMessage("Клиент обновлён");
      setEditingClient(null);
      loadClients();

      if (selectedClient?.id === editingClient.id) {
        setSelectedClient({
          ...editingClient,
          name: editName.trim(),
          phone: editPhone.trim() || null,
          email: editEmail.trim() || null,
          birthday: editBirthday || null,
        });
      }
    }
  };

 const deleteClient = async (id: string) => {
  if (!confirm("Удалить клиента и все его заметки?")) return;

  // Сначала удаляем заметки клиента,
  // иначе foreign key не даст удалить самого клиента
  const { error: notesError } = await supabase
    .from("notes")
    .delete()
    .eq("client_id", id);

  if (notesError) {
    setMessage("Ошибка удаления заметок");
    console.error(notesError);
    return;
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    setMessage("Ошибка удаления клиента");
    console.error(error);
    return;
  }

  setMessage("Клиент удалён");

  if (selectedClient?.id === id) {
    setSelectedClient(null);
    setNotes([]);
  }

  loadClients();
}; 
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage("Не удалось выйти из аккаунта");
      console.error("logout error:", error);
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadNotes(selectedClient.id);
    }
  }, [selectedClient]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 20px 40px",
        fontFamily: "Arial, sans-serif",
        background: colors.pageBg,
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
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
                margin: "12px 0 8px",
                fontSize: "34px",
                lineHeight: 1.08,
                fontWeight: 600,
                color: colors.title,
                letterSpacing: "-0.03em",
              }}
            >
              Клиенты
            </h1>

            <p
              style={{
                margin: 0,
                color: colors.text,
                fontSize: "15px",
                lineHeight: 1.65,
                maxWidth: "620px",
              }}
            >
              Добавляй клиентов, храни заметки и держи важные детали под рукой
              в одном спокойном рабочем пространстве.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                textDecoration: "none",
                height: "52px",
                padding: "0 18px",
                borderRadius: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.accentSoft,
                color: colors.accentDark,
                border: `1px solid ${colors.line}`,
                fontWeight: 700,
              }}
            >
              На главную
            </Link>

            <button
              onClick={handleLogout}
              style={{
                height: "52px",
                padding: "0 18px",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                color: colors.white,
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "0 14px 30px rgba(158, 92, 102, 0.22)",
              }}
            >
              Выйти
            </button>
          </div>
        </header>

        {message && (
          <div
            style={{
              background: colors.accentSoft,
              border: `1px solid ${colors.line}`,
              padding: "14px 16px",
              marginBottom: "20px",
              borderRadius: "16px",
              color: colors.text,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: colors.accentDark,
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <section
            style={{
              flex: 1,
              minWidth: "280px",
              background: colors.cardBg,
              borderRadius: "24px",
              padding: "22px",
              border: colors.cardBorder,
              boxShadow:
                "0 20px 50px rgba(97, 70, 76, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                color: colors.title,
                fontSize: "24px",
              }}
            >
              Добавить клиента
            </h2>

            <input
              type="text"
              placeholder="Имя*"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `1px solid ${colors.line}`,
                background: colors.white,
                color: colors.title,
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <input
              type="tel"
              placeholder="Телефон"
              value={newClientPhone}
              onChange={(e) => setNewClientPhone(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `1px solid ${colors.line}`,
                background: colors.white,
                color: colors.title,
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `1px solid ${colors.line}`,
                background: colors.white,
                color: colors.title,
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <input
              type="date"
              placeholder="День рождения"
              value={newClientBirthday}
              onChange={(e) => setNewClientBirthday(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                border: `1px solid ${colors.line}`,
                background: colors.white,
                color: colors.title,
                boxSizing: "border-box",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <button
              onClick={addClient}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                color: colors.white,
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "0 14px 30px rgba(158, 92, 102, 0.22)",
              }}
            >
              Добавить
            </button>
          </section>

          <section
            style={{
              flex: 2,
              minWidth: "320px",
              background: colors.cardBg,
              borderRadius: "24px",
              padding: "22px",
              border: colors.cardBorder,
              boxShadow:
                "0 20px 50px rgba(97, 70, 76, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                color: colors.title,
                fontSize: "24px",
              }}
            >
              Список клиентов
            </h2>

            {clients.length === 0 ? (
              <p style={{ color: colors.muted }}>Нет клиентов</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {clients.map((client) => (
                  <li
                    key={client.id}
                    style={{
                      padding: "16px",
                      marginBottom: "12px",
                      background:
                        selectedClient?.id === client.id
                          ? colors.accentSoft
                          : colors.white,
                      border: `1px solid ${colors.line}`,
                      borderRadius: "18px",
                    }}
                  >
                    <div
                      onClick={() => setSelectedClient(client)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong
                        style={{
                          display: "block",
                          color: colors.title,
                          fontSize: "17px",
                          marginBottom: "6px",
                        }}
                      >
                        {client.name}
                      </strong>

                      {client.phone && (
                        <div style={{ color: colors.text, marginBottom: "4px" }}>
                          📞 {client.phone}
                        </div>
                      )}

                      {client.email && (
                        <div style={{ color: colors.text, marginBottom: "4px" }}>
                          ✉️ {client.email}
                        </div>
                      )}

                      {client.birthday && (
                        <div style={{ color: colors.text }}>
                          🎂 {client.birthday}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => startEditClient(client)}
                        style={{
                          background: colors.accentSoft,
                          color: colors.accentDark,
                          border: `1px solid ${colors.line}`,
                          borderRadius: "12px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        Редактировать
                      </button>

                      <button
                        onClick={() => deleteClient(client.id)}
                        style={{
                          background: colors.dangerSoft,
                          color: colors.accentDark,
                          border: `1px solid ${colors.line}`,
                          borderRadius: "12px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {selectedClient && (
            <section
              style={{
                flex: 2,
                minWidth: "320px",
                background: colors.cardBg,
                borderRadius: "24px",
                padding: "22px",
                border: colors.cardBorder,
                boxShadow:
                  "0 20px 50px rgba(97, 70, 76, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: colors.title,
                  fontSize: "24px",
                }}
              >
                Заметки: {selectedClient.name}
              </h2>

              <textarea
                placeholder="Новая заметка (формула окрашивания, предпочтения, нюансы ухода и т.п.)"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={4}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "12px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  color: colors.title,
                  boxSizing: "border-box",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "15px",
                }}
              />

              <button
                onClick={addNote}
                style={{
                  padding: "14px 18px",
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                  color: colors.white,
                  border: "none",
                  borderRadius: "14px",
                  cursor: "pointer",
                  marginBottom: "18px",
                  fontWeight: 700,
                  boxShadow: "0 14px 30px rgba(158, 92, 102, 0.22)",
                }}
              >
                Добавить заметку
              </button>

              {notes.length === 0 ? (
                <p style={{ color: colors.muted }}>Нет заметок</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      style={{
                        padding: "14px 16px",
                        marginBottom: "10px",
                        background: colors.white,
                        border: `1px solid ${colors.line}`,
                        borderRadius: "16px",
                      }}
                    >
                      <div
                        style={{
                          color: colors.text,
                          marginBottom: "8px",
                          lineHeight: 1.5,
                        }}
                      >
                        {note.content}
                      </div>
                      <small style={{ color: colors.muted }}>
                        {new Date(note.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {editingClient && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: colors.overlay,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "16px",
            }}
          >
            <div
              style={{
                background: colors.cardBg,
                padding: "24px",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "420px",
                border: colors.cardBorder,
                boxShadow:
                  "0 18px 50px rgba(97, 70, 76, 0.16), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "16px",
                  color: colors.title,
                  fontSize: "24px",
                }}
              >
                Редактировать клиента
              </h3>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Имя"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "10px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  color: colors.title,
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "15px",
                }}
              />

              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Телефон"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "10px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  color: colors.title,
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "15px",
                }}
              />

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "10px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  color: colors.title,
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "15px",
                }}
              />

              <input
                type="date"
                value={editBirthday}
                onChange={(e) => setEditBirthday(e.target.value)}
                placeholder="День рождения"
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "14px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: `1px solid ${colors.line}`,
                  background: colors.white,
                  color: colors.title,
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "15px",
                }}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button
                  onClick={updateClient}
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
                    color: colors.white,
                    border: "none",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Сохранить
                </button>

                <button
                  onClick={() => setEditingClient(null)}
                  style={{
                    flex: 1,
                    background: colors.accentSoft,
                    color: colors.accentDark,
                    border: `1px solid ${colors.line}`,
                    borderRadius: "14px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}