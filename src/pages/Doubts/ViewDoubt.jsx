import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDoubtMessages } from "../../hooks/useDoubtMessages";
import { useSendDoubtMessage } from "../../hooks/useSendDoubtMessage";
import useUser from "../../hooks/useUser";
import { Card, CardBody, Spinner, Input, Button } from "reactstrap";

const ViewDoubt = () => {
  const { id } = useParams();
  const { userDetails } = useUser();
  const userId = userDetails?.uid;
  const { doubt, messages, loading } = useDoubtMessages(id);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Destinatário é o outro participante da dúvida
  const destinatario =
    doubt?.remetente?.value === userId ? doubt?.destinatario : doubt?.remetente;
  const { sendMessage } = useSendDoubtMessage(id, destinatario);

  // Mensagens do Firestore, ordenadas por createdAt
  const allMessages = [...messages].sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return aTime - bTime;
  });

  async function handleSend() {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage("");
    }
  }

  return (
    <Card
      style={{ minHeight: "70vh", display: "flex", flexDirection: "column" }}
    >
      <CardBody
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingBottom: 0,
        }}
      >
        <h4 className="mb-4">Dúvida: {doubt?.doubt}</h4>
        {loading ? (
          <Spinner color="primary" />
        ) : (
          <>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "2rem",
                overflowY: "auto",
                maxHeight: "55vh",
              }}
            >
              {allMessages.length === 0 && (
                <div>Nenhuma mensagem encontrada.</div>
              )}
              {allMessages.map((msg) => {
                const isOwn = msg.remetente?.value === userId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isOwn ? "flex-start" : "flex-end",
                      maxWidth: "60%",
                      background: isOwn ? "#f1f1f1" : "#e3f2fd",
                      borderRadius: "8px",
                      padding: "10px 16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85em",
                        color: "#888",
                        marginBottom: 4,
                      }}
                    >
                      {msg.remetente?.label}
                    </div>
                    <div>{msg.message}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "1rem 0 0.5rem 0",
                borderTop: "1px solid #eee",
                zIndex: 2,
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button color="primary" onClick={handleSend}>
                Enviar
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ViewDoubt;
