import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
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
import { loginUser } from "/src/store/actions";
import logo from "../../assets/images/lgo.png";

const Login = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth?.user);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "" || "",
      password: "" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Por favor, informe o seu e-mail"),
      password: Yup.string().required("Por favor, informe a sua senha"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const LoginProperties = createSelector(
    (state) => state.Login,
    (login) => ({
      error: login.error,
      loading: login.loading,
    })
  );
  const { error, loading } = useSelector(LoginProperties);

  return (
    <div className="login-page-custom-bg">
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
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
            style={{ fontSize: "1.6rem", color: "#f3e6fa", letterSpacing: 1 }}
          >
            LOGIN
          </span>
        </div>
        <Form
          className="login-form-custom"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
          style={{ width: 320, maxWidth: "90vw" }}
        >
          {error ? <Alert color="danger">{error}</Alert> : null}
          <div className="mb-3 position-relative">
            <Label
              className="form-label text-white fw-bold"
              style={{ fontSize: "1.1rem", marginBottom: 4 }}
            >
              E-mail
            </Label>
            <Input
              name="email"
              className="form-control login-input-custom"
              placeholder="Digite seu e-mail"
              type="email"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.email || ""}
              invalid={
                validation.touched.email && validation.errors.email
                  ? true
                  : false
              }
              autoComplete="username"
              disabled={loading}
            />

            {validation.touched.email && validation.errors.email ? (
              <FormFeedback type="invalid">
                {validation.errors.email}
              </FormFeedback>
            ) : null}
          </div>
          <div className="mb-3 position-relative">
            <Label
              className="form-label text-white fw-bold"
              style={{ fontSize: "1.1rem", marginBottom: 4 }}
            >
              Senha
            </Label>
            <Input
              name="password"
              autoComplete="current-password"
              value={validation.values.password || ""}
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.password && validation.errors.password
                  ? true
                  : false
              }
              className="form-control login-input-custom"
              disabled={loading}
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
          <button
            className="btn btn-primary w-100 py-2 fw-bold login-btn-custom"
            type="submit"
            style={{
              background: "#7c4bc0",
              border: "none",
              fontSize: "1.1rem",
              letterSpacing: 0.5,
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" style={{ color: "#fff" }}>
                  Carregando...
                </Spinner>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
          <div className="text-center mt-3">
            <Link
              to="/forgot-password"
              className="text-white-50"
              style={{ fontSize: "0.98rem" }}
            >
              Esqueceu a senha?
            </Link>
          </div>
        </Form>
      </Container>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
