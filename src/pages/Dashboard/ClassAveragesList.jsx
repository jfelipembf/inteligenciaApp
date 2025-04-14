import React from "react";
import PropTypes from 'prop-types';
import { Table, Progress, Badge } from "reactstrap";

const ClassAveragesList = ({ userRole }) => {
  // Dados para o perfil de Gestor/Coordenador (todas as turmas)
  const gestorClasses = [
    { id: 1, name: "Infantil I-A", average: 9.2, students: 25, level: "Educação Infantil" },
    { id: 2, name: "Infantil I-B", average: 9.0, students: 23, level: "Educação Infantil" },
    { id: 3, name: "Infantil II-A", average: 8.9, students: 24, level: "Educação Infantil" },
    { id: 4, name: "1º Ano A", average: 8.7, students: 30, level: "Ensino Fundamental I" },
    { id: 5, name: "2º Ano A", average: 8.5, students: 28, level: "Ensino Fundamental I" },
    { id: 6, name: "3º Ano A", average: 8.3, students: 32, level: "Ensino Fundamental I" },
    { id: 7, name: "6º Ano A", average: 7.9, students: 35, level: "Ensino Fundamental II" },
    { id: 8, name: "7º Ano A", average: 7.8, students: 36, level: "Ensino Fundamental II" },
    { id: 9, name: "8º Ano A", average: 7.5, students: 34, level: "Ensino Fundamental II" },
    { id: 10, name: "1º Ano EM", average: 7.2, students: 38, level: "Ensino Médio" },
    { id: 11, name: "2º Ano EM", average: 7.0, students: 36, level: "Ensino Médio" },
    { id: 12, name: "3º Ano EM", average: 7.4, students: 34, level: "Ensino Médio" }
  ];
  
  // Dados para o perfil de Professor (apenas suas turmas)
  const professorClasses = [
    { id: 4, name: "1º Ano A", average: 8.7, students: 30, level: "Ensino Fundamental I" },
    { id: 7, name: "6º Ano A", average: 7.9, students: 35, level: "Ensino Fundamental II" },
    { id: 10, name: "1º Ano EM", average: 7.2, students: 38, level: "Ensino Médio" }
  ];
  
  // Seleciona as turmas com base no perfil do usuário
  const classes = userRole === "gestor" ? gestorClasses : professorClasses;
  
  // Função para determinar a cor da badge com base na média
  const getBadgeColor = (average) => {
    if (average >= 9.0) return "success";
    if (average >= 8.0) return "primary";
    if (average >= 7.0) return "info";
    if (average >= 6.0) return "warning";
    return "danger";
  };
  
  // Função para determinar a porcentagem da barra de progresso
  const getProgressPercentage = (average) => {
    return (average / 10) * 100;
  };
  
  // Função para determinar a cor da barra de progresso
  const getProgressColor = (average) => {
    if (average >= 9.0) return "success";
    if (average >= 8.0) return "info";
    if (average >= 7.0) return "primary";
    if (average >= 6.0) return "warning";
    return "danger";
  };
  
  return (
    <div className="table-responsive">
      <Table className="table-centered table-nowrap mb-0">
        <thead className="table-light">
          <tr>
            <th>Turma</th>
            <th>Nível</th>
            <th>Alunos</th>
            <th>Média Geral</th>
            <th>Desempenho</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.name}</td>
              <td>{classItem.level}</td>
              <td>{classItem.students}</td>
              <td>
                <Badge color={getBadgeColor(classItem.average)} pill>
                  {classItem.average.toFixed(1)}
                </Badge>
              </td>
              <td style={{ width: "30%" }}>
                <Progress
                  value={getProgressPercentage(classItem.average)}
                  color={getProgressColor(classItem.average)}
                  style={{ height: "10px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

ClassAveragesList.propTypes = {
  userRole: PropTypes.string
};

export default ClassAveragesList;
