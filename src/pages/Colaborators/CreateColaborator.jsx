import React, { useState, useEffect } from "react";
import { Button, Input, FormGroup, Label, Form } from "reactstrap";
import useColaborator from "../../hooks/useColaborator";
import useUser from "../../hooks/useUser"; // Hook para obter o usuário logado

const CreateColaborator = () => {
  const { userDetails } = useUser(); // Obter detalhes do usuário logado
  const { createAccountWithEmail } = useColaborator();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // Estado para a role selecionada
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]); // Roles permitidas

  // Mapeamento de roles (exibido em português -> salvo em inglês)
  const roleMapping = {
    principal: "Diretor",
    coordinator: "Coordenador",
    professor: "Professor",
  };

  useEffect(() => {
    // Determinar roles permitidas com base na role do usuário logado
    if (userDetails?.role === "ceo") {
      setAvailableRoles(["principal", "coordinator", "professor"]);
    } else if (userDetails?.role === "principal") {
      setAvailableRoles(["coordinator", "professor"]);
    } else if (userDetails?.role === "coordinator") {
      setAvailableRoles(["professor"]);
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!role) {
      setMessage("Por favor, selecione uma role.");
      setLoading(false);
      return;
    }

    const result = await createAccountWithEmail(email, role); // Passar a role (em inglês) para a função de criação

    setMessage(result.message);
    setLoading(false);
  };

  return (
    <div>
      <h4>Criar Conta</h4>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">E-mail</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="role">Role</Label>
          <Input
            type="select"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)} // Salva o valor em inglês
            required
          >
            <option value="">Selecione uma role</option>
            {availableRoles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleMapping[roleOption]} {/* Exibe o valor em português */}
              </option>
            ))}
          </Input>
        </FormGroup>
        <Button type="submit" color="primary" disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateColaborator;
