import { useStudentsContext } from "../contexts/StudentsContext";
import { useClassContext } from "../contexts/ClassContext";
import useFetchUsers from "./useFetchUsers";

const useCoordinatorDashboard = () => {
  const { students, loading: loadingStudents } = useStudentsContext();
  const { classes, loading: loadingClasses } = useClassContext();
  const { users, loading: loadingUsers } = useFetchUsers();

  // Professores
  const teachers = users.filter((user) => user.role === "professor");

  // Estatísticas
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  // Média geral dos alunos
  const averageGrade =
    students.reduce((acc, student) => acc + (student.average || 0), 0) /
    (totalStudents || 1);

  // Taxa de aprovação
  const approvedStudents = students.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  // Alunos por turma selecionada (caso queira filtrar)
  const getStudentsByClass = (className) =>
    students.filter((student) => student.class === className);

  // Top alunos
  const topStudents = [...students]
    .sort((a, b) => (b.average || 0) - (a.average || 0))
    .slice(0, 5);

  // Top professores
  const topTeachers = teachers.slice(0, 5);

  return {
    students,
    classes,
    teachers,
    users,
    loading: loadingStudents || loadingClasses || loadingUsers,
    totalStudents,
    totalTeachers,
    totalClasses,
    averageGrade,
    approvalRate,
    getStudentsByClass,
    topStudents,
    topTeachers,
  };
};

export default useCoordinatorDashboard;
