import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { UsersProvider } from "../contexts/UsersContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { ProfessorDashboardProvider } from "../contexts/ProfessorDashboardContext";
import { CoordinatorDashboardProvider } from "../contexts/CoordinatorDashboardContext";
import { EventsProvider } from "../contexts/EventsContext";
import RoleProtectedRoute from "./roleProtectedRoutes";

// Pages Component
// import Chat from "../pages/Chat/Chat";

//  // Home
import Home from "../pages/Home/Home";

// // Unauthorized
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// // File Manager
import FileManager from "../pages/FileManager/index";

// // Profile
import UserProfile from "../pages/Authentication/user-profile";

// // //Attendance
import NewAttendance from "../pages/Attendance/NewAttendance";
import Attendances from "../pages/Attendance/Attendances";

// // // Teacher classes
import TeacherClasses from "../pages/Classes/TeacherClasses/TeacherClasses";

// Pages Calendar
import Calendar from "../pages/Calendar/index";

// // //Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProductDetail/index";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index";
import EcommerenceAddProduct from "../pages/Ecommerce/EcommerceAddProduct";

// //Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";
import EmailBasicTemplte from "../pages/Email/email-basic-templte";
import EmailAlertTemplte from "../pages/Email/email-template-alert";
import EmailTemplateBilling from "../pages/Email/email-template-billing";

// //Invoices
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// //  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Login2 from "../pages/AuthenticationInner/Login2";
import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardSaas from "../pages/Dashboard-saas/index";
import DashboardCrypto from "../pages/Dashboard-crypto/index";

import GestorDashboard from "../pages/Dashboard/GestorDashboard";
import CoordenadorDashboard from "../pages/Dashboard/CoordenadorDashboard";
import ProfessorDashboard from "../pages/Dashboard/ProfessorDashboard";

// //Crypto
import CryptoWallet from "../pages/Crypto/CryptoWallet/crypto-wallet";
import CryptoBuySell from "../pages/Crypto/crypto-buy-sell";
import CryptoExchange from "../pages/Crypto/crypto-exchange";
import CryptoLending from "../pages/Crypto/crypto-lending";
import CryptoOrders from "../pages/Crypto/CryptoOrders";
import CryptoKYCApplication from "../pages/Crypto/crypto-kyc-application";
import CryptoIcoLanding from "../pages/Crypto/CryptoIcoLanding/index";

// // Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/charts-knob";
import ReCharts from "../pages/Charts/ReCharts";

// //Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialTreeShaking";
import IconFontawesome from "../pages/Icons/IconFontawesomeSimple";

// // Forms
import FormElements from "../pages/Forms/FormElements";
import FormLayouts from "../pages/Forms/FormLayouts";
import FormAdvanced from "../pages/Forms/FormAdvanced/index";
import FormEditors from "../pages/Forms/FormEditors";
import FormValidations from "../pages/Forms/FormValidations";
import FormMask from "../pages/Forms/FormMask";
import FormRepeater from "../pages/Forms/FormRepeater";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";

// //Ui
import UiAlert from "../pages/Ui/UiAlerts/index";
import UiButtons from "../pages/Ui/UiButtons/index";
import UiCards from "../pages/Ui/UiCard/index";
import UiCarousel from "../pages/Ui/UiCarousel";
import UiColors from "../pages/Ui/UiColors";
import UiDropdown from "../pages/Ui/UiDropdown/index";
import UiOffCanvas from "../pages/Ui/UiOffCanvas";

import UiGeneral from "../pages/Ui/UiGeneral";
import UiGrid from "../pages/Ui/UiGrid";
import UiImages from "../pages/Ui/UiImages";
import UiLightbox from "../pages/Ui/UiLightbox";
import UiModal from "../pages/Ui/UiModal/index";

import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
import UiTypography from "../pages/Ui/UiTypography";
import UiVideo from "../pages/Ui/UiVideo";
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
import UiRating from "../pages/Ui/UiRating";
import UiRangeSlider from "../pages/Ui/UiRangeSlider";
import UiNotifications from "../pages/Ui/UINotifications";

import UiPlaceholders from "../pages/Ui/UiPlaceholders";
import UiToasts from "../pages/Ui/UiToast";
import UiUtilities from "../pages/Ui/UiUtilities";

// //Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesTimeline from "../pages/Utility/pages-timeline";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";

// //Contacts
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/index";
import UiProgressbar from "../pages/Ui/UiProgressbar";

import Schools from "../pages/Schools/index";
import CreateSchool from "../pages/Schools/CreateSchool";
import SchoolProfile from "../pages/Schools/SchoolProfile";
import Students from "../pages/Students/index";
import StudentProfile from "../pages/Students/StudentProfile/index";
import TeacherProfile from "../pages/Teachers/TeacherProfile/index";
import Teachers from "../pages/Teachers/index";
import CreateClass from "../pages/Classes/CreateClass";
import ListClasses from "../pages/Classes/ListClasses";
import ViewClass from "../pages/Classes/ViewClass";
import TeacherActivities from "../pages/Teachers/TeacherActivities";
import TeacherMessages from "../pages/Teachers/TeacherMessages";

import Caixa from "../pages/Financeiro/Caixa/index";

// Student routes
import AddStudent from "../pages/Students/AddStudent";

// Acivities routes
import Activities from "../pages/Activities/Activities";
import NewActivity from "../pages/Activities/NewActivity";
import EditActivity from "../pages/Activities/EditActivity";
import Activity from "../pages/Activities/Activity";

//Coordenador

import Coordinators from "../pages/Coordinator/index";
import CoordinatorProfile from "../pages/Coordinator/CoordinatorProfile/index";

//Colaborator
import CreateColaborator from "../pages/Colaborators/CreateColaborator";

import CreateClassroom from "../pages/Classes/Classroom/CreateClassroom";

import Events from "../pages/Events/index";
import CreateEvent from "../pages/Events/CreateEvent";
import ViewEvent from "../pages/Events/ViewEvent";

import Notifications from "../pages/Notifications/index";
import CreateNotification from "../pages/Notifications/CreateNotification";
import ViewNotification from "../pages/Notifications/ViewNotification";

import Messages from "../pages/Messages/index";
import CreateMessage from "../pages/Messages/CreateMessage";
import ReplyMessage from "../pages/Messages/ReplyMessage";

import Settings from "../pages/Settings/index";

import GradesPage from "../pages/Grades/GradesPage";

import GradesListPage from "../pages/Grades/GradesListPage";

import DoubtsList from "../pages/Doubts/DoubtsList";
import ViewDoubt from "../pages/Doubts/ViewDoubt";

//Principals
import Principals from "../pages/Principals/index";
import PrincipalProfile from "../pages/Principals/PrincipalProfile/index";

const EventsRoutes = ({ children }) => (
  <EventsProvider>{children}</EventsProvider>
);

EventsRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: (
      <RoleProtectedRoute allowedRoles={["administrator"]}>
        <Dashboard />
      </RoleProtectedRoute>
    ),
  },
  { path: "/dashboard-saas", component: <DashboardSaas /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  {
    path: "/dashboard-gestor",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo"]}>
        {" "}
        <GestorDashboard />{" "}
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/dashboard-coordenador",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <CoordinatorDashboardProvider>
          <CoordenadorDashboard />
        </CoordinatorDashboardProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/dashboard-professor",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <ProfessorDashboardProvider>
          <ProfessorDashboard />
        </ProfessorDashboardProvider>
      </RoleProtectedRoute>
    ),
  },

  // Home
  { path: "/home", component: <Home /> },
  { path: "/app", component: <Home /> },

  // Attendance
  {
    path: "/create-attendance",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        {" "}
        <NewAttendance />
      </RoleProtectedRoute>
    ),
  },
  { path: "/attendances", component: <Attendances /> },

  {
    path: "/myclasses",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        {" "}
        <TeacherClasses />
      </RoleProtectedRoute>
    ),
  },

  //Doubts
  {
    path: "/doubts",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <DoubtsList />
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/doubts/:id",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <ViewDoubt />
      </RoleProtectedRoute>
    ),
  },

  // Grades
  {
    path: "/grades",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <GradesPage />
      </RoleProtectedRoute>
    ),
  },
  { path: "/grades-list", component: <GradesListPage /> },

  // Classes
  {
    path: "/create-class",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <CreateClass />
      </RoleProtectedRoute>
    ),
  },
  { path: "/classes", component: <ListClasses /> },
  { path: "/classes/:id", component: <ViewClass /> },

  // Classrooms
  {
    path: "classes/:classId/create-classroom",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <CreateClassroom />
      </RoleProtectedRoute>
    ),
  },

  // Students
  { path: "/students", component: <Students /> },
  {
    path: "classes/:classId/add-student",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <AddStudent />{" "}
      </RoleProtectedRoute>
    ),
  },
  { path: "/students/:id", component: <StudentProfile /> },
  { path: "classes/:classId/students/:id", component: <StudentProfile /> },

  // Teachers
  {
    path: "/teachers",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <Teachers />{" "}
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/teachers/:id",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <TeacherProfile />{" "}
      </RoleProtectedRoute>
    ),
  },
  { path: "/teachers/:id/activities", component: <TeacherActivities /> },
  { path: "/teachers/:id/messages", component: <TeacherMessages /> },

  //Principals
  {
    path: "/principals",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <Principals />{" "}
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/principals/:id",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <PrincipalProfile />
      </RoleProtectedRoute>
    ),
  },

  //Coordinator

  {
    path: "/coordinators",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <Coordinators />{" "}
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/coordinators/:id",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <CoordinatorProfile />
      </RoleProtectedRoute>
    ),
  },

  {
    path: "/colaborators/create",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        <CreateColaborator />{" "}
      </RoleProtectedRoute>
    ),
  },

  //   //Crypto
  { path: "/crypto-wallet", component: <CryptoWallet /> },
  { path: "/crypto-buy-sell", component: <CryptoBuySell /> },
  { path: "/crypto-exchange", component: <CryptoExchange /> },
  { path: "/crypto-landing", component: <CryptoLending /> },
  { path: "/crypto-orders", component: <CryptoOrders /> },
  { path: "/crypto-kyc-application", component: <CryptoKYCApplication /> },

  // //File Manager
  { path: "/apps-filemanager", component: <FileManager /> },

  // //calendar
  { path: "/calendar", component: <Calendar /> },

  //   // //profile
  { path: "/profile", component: <UserProfile /> },

  //   //Ecommerce
  {
    path: "/ecommerce-product-detail/:id",
    component: <EcommerceProductDetail />,
  },
  { path: "/ecommerce-products", component: <EcommerceProducts /> },
  { path: "/ecommerce-orders", component: <EcommerceOrders /> },
  { path: "/ecommerce-customers", component: <EcommerceCustomers /> },
  { path: "/ecommerce-cart", component: <EcommerceCart /> },
  { path: "/ecommerce-checkout", component: <EcommerceCheckout /> },
  { path: "/ecommerce-shops", component: <EcommerceShops /> },
  { path: "/ecommerce-add-product", component: <EcommerenceAddProduct /> },

  //   //Email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read/:id?", component: <EmailRead /> },
  { path: "/email-template-basic", component: <EmailBasicTemplte /> },
  { path: "/email-template-alert", component: <EmailAlertTemplte /> },
  { path: "/email-template-billing", component: <EmailTemplateBilling /> },

  //   //Invoices
  { path: "/invoices-list", component: <InvoicesList /> },
  { path: "/invoices-detail", component: <InvoiceDetail /> },
  { path: "/invoices-detail/:id?", component: <InvoiceDetail /> },

  // Contacts
  { path: "/contacts-grid", component: <ContactsGrid /> },
  { path: "/contacts-list", component: <ContactsList /> },
  { path: "/contacts-profile", component: <ContactsProfile /> },

  //   //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs-charts", component: <ChartjsChart /> },
  { path: "/e-charts", component: <EChart /> },
  { path: "/sparkline-charts", component: <SparklineChart /> },
  { path: "/charts-knob", component: <ChartsKnob /> },
  { path: "/re-charts", component: <ReCharts /> },

  //    // Unauthorized
  { path: "/unauthorized", component: <Unauthorized /> },

  //   // Icons
  { path: "/icons-boxicons", component: <IconBoxicons /> },
  { path: "/icons-dripicons", component: <IconDripicons /> },
  { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  { path: "/icons-fontawesome", component: <IconFontawesome /> },

  //   // Forms
  { path: "/form-elements", component: <FormElements /> },
  { path: "/form-layouts", component: <FormLayouts /> },
  { path: "/form-advanced", component: <FormAdvanced /> },
  { path: "/form-editors", component: <FormEditors /> },
  { path: "/form-mask", component: <FormMask /> },
  { path: "/form-repeater", component: <FormRepeater /> },
  { path: "/form-uploads", component: <FormUpload /> },
  { path: "/form-wizard", component: <FormWizard /> },
  { path: "/form-validation", component: <FormValidations /> },

  //   // Ui
  { path: "/ui-alerts", component: <UiAlert /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-dropdowns", component: <UiDropdown /> },
  { path: "/ui-offcanvas", component: <UiOffCanvas /> },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-lightbox", component: <UiLightbox /> },
  { path: "/ui-modals", component: <UiModal /> },
  { path: "/ui-progressbars", component: <UiProgressbar /> },
  { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-video", component: <UiVideo /> },
  { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  { path: "/ui-rating", component: <UiRating /> },
  { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  { path: "/ui-notifications", component: <UiNotifications /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-toasts", component: <UiToasts /> },
  { path: "/ui-utilities", component: <UiUtilities /> },

  //   //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-faqs", component: <PagesFaqs /> },
  { path: "/pages-pricing", component: <PagesPricing /> },

  // Rotas de Classes
  {
    path: "/create-class",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "coordinator", "principal"]}>
        {" "}
        <CreateClass />{" "}
      </RoleProtectedRoute>
    ),
  },
  { path: "/classes", component: <ListClasses /> },

  // Rotas de Escolas
  {
    path: "/schools",
    component: (
      <RoleProtectedRoute allowedRoles={["master", "ceo"]}>
        <Schools />
      </RoleProtectedRoute>
    ),
  }, // Lista de Escolas
  {
    path: "/schools/create",
    component: (
      <RoleProtectedRoute allowedRoles={["master"]}>
        <CreateSchool />
      </RoleProtectedRoute>
    ),
  }, // Nova Escola
  {
    path: "/schools/:id/*",
    component: (
      <RoleProtectedRoute allowedRoles={["master", "ceo"]}>
        <SchoolProfile />
      </RoleProtectedRoute>
    ),
  },

  //Rotas de Atividades
  {
    path: "/activities",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <Activities />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/activities/add-activity",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        {" "}
        <NewActivity />{" "}
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/activities/edit-activity/:id/:classId/:lessonId",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <EditActivity />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/activities/activity/:id/:classId/:lessonId",
    component: (
      <RoleProtectedRoute allowedRoles={["professor"]}>
        <Activity />
      </RoleProtectedRoute>
    ),
  },

  // Rotas Financeiro
  { path: "/financeiro/caixa", component: <Caixa /> },

  // Rotas de Eventos
  {
    path: "/events",
    component: (
      <EventsRoutes>
        {" "}
        <Events />
      </EventsRoutes>
    ),
  },
  { path: "/events/create", component: <CreateEvent /> },
  {
    path: "/events/:id",
    component: (
      <EventsRoutes>
        <ViewEvent />
      </EventsRoutes>
    ),
  },
  { path: "/events/:id/edit", component: <CreateEvent /> },

  // Rotas de Notificações
  {
    path: "/notifications",
    component: (
      <NotificationsProvider>
        {" "}
        <Notifications />
      </NotificationsProvider>
    ),
  },
  {
    path: "/notifications/create",
    component: (
      <UsersProvider>
        <CreateNotification />
      </UsersProvider>
    ),
  },
  {
    path: "/notifications/:id",
    component: (
      <NotificationsProvider>
        {" "}
        <ViewNotification />
      </NotificationsProvider>
    ),
  },

  // Rota de Configurações
  {
    path: "/settings",
    component: (
      <RoleProtectedRoute allowedRoles={["administrator"]}>
        <Settings />
      </RoleProtectedRoute>
    ),
  },

  // Rotas de Mensagens
  { path: "/messages", component: <Messages /> },
  { path: "/messages/create", component: <CreateMessage /> },
  { path: "/messages/:id", component: <ReplyMessage /> },
  { path: "/messages/reply/:id", component: <ReplyMessage /> },
  { path: "/messages/forward/:id", component: <CreateMessage /> },

  // Redirecionamento de /chat para /messages
  { path: "/chat", component: <Navigate to="/messages" /> },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/home" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },
  { path: "/crypto-ico-landing", component: <CryptoIcoLanding /> },

  //   // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  { path: "/pages-login-2", component: <Login2 /> },
  { path: "/pages-register", component: <Register1 /> },
  { path: "/pages-register-2", component: <Register2 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  { path: "/pages-forgot-pwd-2", component: <ForgetPwd2 /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  {
    path: "/auth-two-step-verification-2",
    component: <TwostepVerification2 />,
  },

  // Students
  {
    path: "/add-student",
    component: (
      <RoleProtectedRoute allowedRoles={["ceo", "principal", "coordinator"]}>
        {" "}
        <AddStudent />{" "}
      </RoleProtectedRoute>
    ),
  },
];

// export { authProtectedRoutes, publicRoutes };
export { authProtectedRoutes, publicRoutes };
