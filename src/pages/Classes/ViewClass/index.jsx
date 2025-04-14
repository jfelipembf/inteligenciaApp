import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import useClassData from "../../../hooks/useClassData";
import useManageStudents from "../../../hooks/useManageStudents";
import useFetchLessons from "../../../hooks/useFetchLessons";
import useUpdateClass from "../../../hooks/useUpdateClass";
import useLessonManagement from "../../../hooks/useLessonManagement";
import useFetchTeachers from "../../../hooks/useFetchTeachers";
import classnames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importando componentes
import { 
  ClassHeader, 
  StudentsList, 
  LessonsList, 
  ClassModals 
} from "./components";

// Importando estilos e constantes
import { periodOptions, roomOptions } from "./utils/selectStyles";
import { ALL_SCHOOL_YEARS } from "../../../constants/schoolYear";

const ViewClass = () => {
  const { id: classId } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  
  // Estados para controlar validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estados para o modal de adicionar/remover alunos
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [removeStudentModal, setRemoveStudentModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para o modal de editar turma
  const [editClassModal, setEditClassModal] = useState(false);
  const [editClassData, setEditClassData] = useState({});

  // Estados para aulas
  const { lessons, loading: lessonsLoading, error: lessonsError } = useFetchLessons(classId);
  const [localLessons, setLocalLessons] = useState([]);
  const [editLessonModal, setEditLessonModal] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [removeLessonModal, setRemoveLessonModal] = useState(false);
  const [lessonToRemove, setLessonToRemove] = useState(null);

  // Dados dos professores
  const {
    teachers,
    loading: loadingTeachers,
  } = useFetchTeachers();

  const toggleTab = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleRemoveLessonModal = (lesson) => {
    setLessonToRemove(lesson);
    setRemoveLessonModal(!removeLessonModal);
  };
  
  const toggleEditLessonModal = (lesson) => {
    setLessonToEdit(lesson);
    setEditLessonModal(!editLessonModal);
  };
  
  const toggleEditClassModal = () => {
    setEditClassModal(!editClassModal);
    if (!editClassModal) {
      // Formatando as datas para o formato brasileiro quando abre o modal
      const formattedData = {
        ...classData,
        className: classData.className || "",
        year: classData.year || "",
        period: classData.period || "",
        status: classData.status || "",
        startDate: classData.startDate ? formatDateToBrazilian(classData.startDate) : "",
        endDate: classData.endDate ? formatDateToBrazilian(classData.endDate) : "",
      };
      setEditClassData(formattedData);
    }
  };

  // Função para formatar data para exibição brasileira
  const formatDateToBrazilian = (dateString) => {
    if (!dateString) return "";
    // Converter formato YYYY-MM-DD para DD/MM/YYYY
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    if (!lessonsLoading && lessons) {
      setLocalLessons(lessons);
    }
  }, [lessonsLoading, lessons]);

  const {
    classData,
    students,
    setStudents,
    loading: classLoading,
    error: classError,
  } = useClassData(classId);

  // Hooks para gerenciamento de turmas, alunos e aulas
  const { updateClass } = useUpdateClass();
  const { 
    removeStudentFromClass, 
    addStudentsToClass, 
    fetchAvailableStudents,
    availableStudents,
  } = useManageStudents(classId, classData?.schoolId);
  const { 
    updateLesson, 
    removeLesson,
  } = useLessonManagement(classId, classData?.schoolId);

  // Toggle do modal de adicionar alunos
  const toggleAddStudentModal = () => {
    if (!addStudentModal) {
      fetchAvailableStudents();
    }
    setAddStudentModal(!addStudentModal);
    setSelectedStudents([]);
    setSearchTerm("");
  };

  // Toggle do modal de remover aluno
  const toggleRemoveStudentModal = (student) => {
    setStudentToRemove(student);
    setRemoveStudentModal(!removeStudentModal);
  };

  if (classLoading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando informações da turma...</p>
        </div>
      </div>
    );
  }

  if (classError) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Erro ao carregar dados</h4>
            <p>{classError}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Turmas"
            breadcrumbItem="Detalhes da Turma"
          />

          {/* Cabeçalho da turma */}
          <ClassHeader 
            classData={classData} 
            onEditClass={toggleEditClassModal} 
          />

          {/* Abas para alunos e aulas */}
          <Row>
            <Col>
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggleTab("1")}
                  >
                    <i className="bx bx-user-circle me-1"></i> Alunos
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                  >
                    <i className="bx bx-book-open me-1"></i> Aulas
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <StudentsList 
                    students={students}
                    availableStudents={availableStudents}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedStudents={selectedStudents}
                    setSelectedStudents={setSelectedStudents}
                    addStudentsToClass={addStudentsToClass}
                    removeStudentFromClass={removeStudentFromClass}
                    setStudents={setStudents}
                    toggleAddStudentModal={toggleAddStudentModal}
                    toggleRemoveStudentModal={toggleRemoveStudentModal}
                    addStudentModal={addStudentModal}
                    removeStudentModal={removeStudentModal}
                    studentToRemove={studentToRemove}
                    errors={errors}
                    setErrors={setErrors}
                    touched={touched}
                    setTouched={setTouched}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <LessonsList 
                    lessons={localLessons}
                    setLocalLessons={setLocalLessons}
                    updateLesson={updateLesson}
                    removeLesson={removeLesson}
                    toggleEditLessonModal={toggleEditLessonModal}
                    toggleRemoveLessonModal={toggleRemoveLessonModal}
                  />
                </TabPane>
              </TabContent>
            </Col>
          </Row>

          {/* Modais */}
          <ClassModals 
            // Modais de edição de turma
            editClassModal={editClassModal}
            toggleEditClassModal={toggleEditClassModal}
            editClassData={editClassData}
            setEditClassData={setEditClassData}
            updateClass={updateClass}
            classId={classId}
            schoolId={classData?.schoolId}
            
            // Modais de alunos
            addStudentModal={addStudentModal}
            toggleAddStudentModal={toggleAddStudentModal}
            removeStudentModal={removeStudentModal}
            toggleRemoveStudentModal={toggleRemoveStudentModal}
            studentToRemove={studentToRemove}
            selectedStudents={selectedStudents}
            handleAddStudentsToClass={addStudentsToClass}
            removeStudentFromClass={removeStudentFromClass}
            filteredStudents={availableStudents.filter((student) => {
              const searchTermLower = searchTerm.toLowerCase();
              const studentName = student.personalInfo?.name?.toLowerCase() || "";
              const studentRegistration = student.academicInfo?.registration?.toLowerCase() || "";
              return (
                studentName.includes(searchTermLower) || studentRegistration.includes(searchTermLower)
              );
            })}
            handleSelectStudent={(student) => {
              if (!selectedStudents.some((s) => s.id === student.id)) {
                setSelectedStudents([...selectedStudents, student]);
              }
            }}
            handleRemoveSelectedStudent={(studentId) => {
              setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
            }}
            searchTerm={searchTerm}
            handleInputChange={(e) => {
              const { name, value } = e.target;
              setSearchTerm(value);
              const error = name === "search" && !value ? "O termo de pesquisa é obrigatório" : "";
              setErrors((prev) => ({ ...prev, [name]: error }));
            }}
            handleBlur={(e) => {
              const { name } = e.target;
              setTouched((prev) => ({ ...prev, [name]: true }));
            }}
            errors={errors}
            touched={touched}
            
            // Modais de aulas
            editLessonModal={editLessonModal}
            toggleEditLessonModal={toggleEditLessonModal}
            lessonToEdit={lessonToEdit}
            setLessonToEdit={setLessonToEdit}
            updateLesson={updateLesson}
            removeLessonModal={removeLessonModal}
            toggleRemoveLessonModal={toggleRemoveLessonModal}
            lessonToRemove={lessonToRemove}
            removeLesson={removeLesson}
            setLocalLessons={setLocalLessons}
            
            // Dados adicionais
            teachers={teachers}
            loadingTeachers={loadingTeachers}
            periodOptions={periodOptions}
            roomOptions={roomOptions}
          />
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ViewClass;
