import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Alert,
  Spinner,
} from "reactstrap";
import { resetPassword } from "../../store/actions";
import logo from "../../assets/images/lgo.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPage = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);
  const dispatch = useDispatch();
  const query = useQuery();
  const oobCode = query.get("oobCode");

  const [resetError, setResetError] = React.useState(null);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("Por favor,informe a nova senhaa"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "As senhas não conferem")
        .required("Por favor, confirme a nova senha"),
    }),
    onSubmit: async (values) => {
      setResetLoading(true);
      setResetError(null);
      setResetSuccess(false);

      if (!oobCode) {
        setResetError("Código de redefinição não encontrado. Tente novamente");
        setResetLoading(false);
        return;
      }

      try {
        dispatch(
          resetPassword(
            { oobCode: oobCode, newPassword: values.password },
            props.router.navigate
          )
        );
      } catch (error) {
        setResetError(
          `Erro ao redefinir a senha. O link expirou!! (${error.message})`
        );
      } finally {
        setResetLoading(false);
      }
    },
  });

  return (
    <div className="login-page-custom-bg">
      <Container className="d-flex flex column justify-content-center align-items-center min-vh-100">
        <div className="text-center mb-2">
          <img
            src={logo}
            alt="Inteligência"
            style={{
              width: 250,
              marginBottom: 12,
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        <div className="text-center mb-2">
          <span
            className="fw-bold"
            style={{
              fontSize: "1.6rem",
              color: "#f3e6fa",
              letterSpacing: 1,
            }}
          >
            REDEFINIR SENHA
          </span>
        </div>

        <Form
          className="login-form-custom"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
          style={{ Width: 320, maxWidth: "90vw" }}
        >
          {resetError ? <Alert color="danger">{resetError}</Alert> : null}
          {resetSuccess ? (
            <Alert color="success">
              ✅ Senha redefinida com sucesso! Você será redirecionado para o
              login.
            </Alert>
          ) : null}

          <div className="mb-3 position-relative">
            <Label
              className="form-label text-white fw-bold"
              style={{ fontSize: "1.1rem", marginBottom: 4 }}
            >
              Nova Senha
            </Label>
            <Input
              name="password"
              value={validation.values.password || ""}
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua nova senha"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.password && validation.errors.password
                  ? true
                  : false
              }
              className="form-control login-input-custom"
              disabled={resetLoading}
            />

            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 12,
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className={showPassword ? "bx bx-show" : "bx bx-hide"} />
            </span>
            {validation.touched.password && validation.errors.password ? (
              <FormFeedback type="invalid">
                {validation.errors.password}
              </FormFeedback>
            ) : null}
          </div>

          <div className="mb-3 position-relative">
            <Label
              className="form-label text-white fw-bold"
              style={{ fontSize: "1.1rem", marginBottom: 4 }}
            >
              Confirmar Senha
            </Label>
            <Input
              name="confirmPassword"
              value={validation.values.confirmPassword || ""}
              type={confirmPassword ? "text" : "password"}
              placeholder="Confirme a nova senha"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.confirmPassword &&
                validation.errors.confirmPassword
                  ? true
                  : false
              }
              className="form-control login-input-custom"
              disabled={resetLoading}
            />

            <span
              onClick={() => setConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 12,
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className={confirmPassword ? "bx bx-show" : "bx bx-hide"} />
            </span>
            {validation.touched.confirmPassword &&
            validation.errors.confirmPassword ? (
              <FormFeedback type="invalid">
                {validation.errors.confirmPassword}
              </FormFeedback>
            ) : null}
          </div>

          <button
            className="btn btn-primary w-100 py-2 fw-bold login-btn-custom"
            type="submit"
            style={{
              background: "#7c4bc0",
              border: "none",
              fontSize: "1.1rem",
              letterSpacing: 0.5,
            }}
            disabled={resetLoading || resetSuccess}
          >
            {resetLoading ? (
              <>
                <Spinner size="sm" className="me-2" style={{ color: "#fff" }}>
                  Carregando...
                </Spinner>
                Redefinindo...
              </>
            ) : (
              "REDEFINIR"
            )}
          </button>

          <div className="text-center mt-3">
            <Link
              to="login"
              className="text-white-50"
              style={{ fontSize: "0.98rem" }}
            >
              Voltar para o Login
            </Link>
          </div>
        </Form>
      </Container>
    </div>
  );
};

ResetPage.propTypes = {
  router: PropTypes.object,
};

export default withRouter(ResetPage);
