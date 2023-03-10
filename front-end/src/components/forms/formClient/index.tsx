import { useForm } from "react-hook-form";
import { Container, FormStyle } from "./style";
import { AuthContext, IDataRegister } from "../../../contexts/AuthContext";
import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClientRegister } from "../../../validations/validationRegister";
import { useNavigate } from "react-router-dom";

export const FormClientRegister = () => {
  const navigate = useNavigate();
  const { clientRegister } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDataRegister>({
    resolver: yupResolver(schemaClientRegister),
  });

  const onSubmitFunction = (data: IDataRegister) => {
    const castedData = data as IDataRegister;
    clientRegister(castedData);
  };

  return (
    <Container>
      <FormStyle onSubmit={handleSubmit(onSubmitFunction)}>
        <h2>Make your registration</h2>
        <input type="text" placeholder="Full Name" {...register("name")} />
        <p className="error">{errors.name?.message}</p>

        <input
          className="error"
          type="text"
          placeholder="Email"
          {...register("email")}
        />
        <p>{errors.email?.message}</p>

        <input type="text" placeholder="Phone" {...register("telephone")} />
        <p className="error">{errors.telephone?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <p className="error">{errors.password?.message}</p>

        <button className="btn" type="submit">
          Register
        </button>

        <button
          className="btnback"
          type="button"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
      </FormStyle>
    </Container>
  );
};
