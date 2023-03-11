import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const FormContainer = styled.div`
  width: 40%;
`;

const Login = ({ vendor, socket }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const onSubmit =() => {


  }
  return (
    <Container>
      <FormContainer>
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="text"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="ps-form__submit text-center">
          <button className="ps-btn success" onClick={onSubmit}>
            Loginnn
          </button>
        </div>
      </FormContainer>
    </Container>
  );
};
export default connect((state) => state.app)(Login);
