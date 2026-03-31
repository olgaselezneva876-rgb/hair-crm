"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  birthday: string | null;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientBirthday, setNewClientBirthday] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [message, setMessage] = useState("");

  // Редактирование
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBirthday, setEditBirthday] = useState("");

  const loadClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setMessage("Ошибка загрузки клиентов");
    else setClients(data || []);
  };

  const loadNotes = async (clientId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    if (error) setMessage("Ошибка загрузки заметок");
    else setNotes(data || []);
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
    if (error) setMessage("Ошибка добавления клиента");
    else {
      setMessage("Клиент добавлен!");
      setNewClientName("");
      setNewClientPhone("");
      setNewClientEmail("");
      setNewClientBirthday("");
      loadClients();
    }
  };

  const addNote = async () => {
    if (!selectedClient) return;
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
    if (error) setMessage("Ошибка добавления заметки");
    else {
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
        name: editName,
        phone: editPhone || null,
        email: editEmail || null,
        birthday: editBirthday || null,
      })
      .eq("id", editingClient.id);
    if (error) setMessage("Ошибка обновления клиента");
    else {
      setMessage("Клиент обновлён");
      setEditingClient(null);
      loadClients();
      if (selectedClient?.id === editingClient.id) {
        setSelectedClient(null);
      }
    }
  };

  const deleteClient = async (id: string) => {
    if (confirm("Удалить клиента и все его заметки?")) {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) setMessage("Ошибка удаления");
      else {
        setMessage("Клиент удалён");
        if (selectedClient?.id === id) setSelectedClient(null);
        loadClients();
      }
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) loadNotes(selectedClient.id);
  }, [selectedClient]);

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Клиенты</h1>
      {message && (
        <div style={{ background: "#f0f0f0", padding: "12px", marginBottom: "20px", borderRadius: "8px" }}>
          {message}
          <button onClick={() => setMessage("")} style={{ marginLeft: "12px", cursor: "pointer" }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        {/* Форма добавления клиента */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h2>Добавить клиента</h2>
          <input
            type="text"
            placeholder="Имя*"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={newClientPhone}
            onChange={(e) => setNewClientPhone(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newClientEmail}
            onChange={(e) => setNewClientEmail(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
          />
          <input
            type="date"
            placeholder="День рождения"
            value={newClientBirthday}
            onChange={(e) => setNewClientBirthday(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
          />
          <button
            onClick={addClient}
            style={{ padding: "8px 16px", background: "#b9966b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Добавить
          </button>
        </div>

        {/* Список клиентов */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <h2>Список клиентов</h2>
          {clients.length === 0 ? (
            <p>Нет клиентов</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {clients.map((client) => (
                <li
                  key={client.id}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    background: selectedClient?.id === client.id ? "#f0f0f0" : "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <div onClick={() => setSelectedClient(client)} style={{ cursor: "pointer" }}>
                    <strong>{client.name}</strong>
                    {client.phone && <div>📞 {client.phone}</div>}
                    {client.email && <div>✉️ {client.email}</div>}
                    {client.birthday && <div>🎂 {client.birthday}</div>}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                    <button onClick={() => startEditClient(client)} style={{ background: "#f0f0f0", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>
                      Редактировать
                    </button>
                    <button onClick={() => deleteClient(client.id)} style={{ background: "#f0f0f0", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Заметки выбранного клиента */}
        {selectedClient && (
          <div style={{ flex: 2, minWidth: "300px" }}>
            <h2>Заметки: {selectedClient.name}</h2>
            <textarea
              placeholder="Новая заметка (формула окрашивания и т.п.)"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={3}
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <button
              onClick={addNote}
              style={{ padding: "8px 16px", background: "#b9966b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "16px" }}
            >
              Добавить заметку
            </button>
            {notes.length === 0 ? (
              <p>Нет заметок</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {notes.map((note) => (
                  <li
                    key={note.id}
                    style={{ padding: "12px", marginBottom: "8px", background: "#fff", border: "1px solid #ddd", borderRadius: "8px" }}
                  >
                    <div>{note.content}</div>
                    <small style={{ color: "#999" }}>{new Date(note.created_at).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Форма редактирования клиента (модалка) */}
      {editingClient && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", width: "90%", maxWidth: "400px" }}>
            <h3>Редактировать клиента</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Имя"
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="Телефон"
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email"
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <input
              type="date"
              value={editBirthday}
              onChange={(e) => setEditBirthday(e.target.value)}
              placeholder="День рождения"
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={updateClient} style={{ background: "#b9966b", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>
                Сохранить
              </button>
              <button onClick={() => setEditingClient(null)} style={{ background: "#ccc", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}