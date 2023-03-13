import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import styled from "styled-components";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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
  const [error, setError] = useState("")
  const dispatch = useDispatch();
  const router = useRouter()
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const onSubmit =(e) => {
    e.preventDefault();
    setError('')
    socket.emit("VENDOR_LOGIN", {email, password})
    socket.on("VENDOR_LOGIN_SUCCESS", (vendor)=> {
        Cookies.set('dollup_logged_in_vendor',JSON.stringify(vendor), { expires: 1 } )
        router.push('/')
    })
    socket.on("VENDOR_LOGIN_ERROR", (err) => {
        setError(err.message)
    })
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
            Login
          </button>
        </div>
        <div className="ps-form__submit text-center">
          {error}
        </div>
      </FormContainer>
    </Container>
  );
};
export default connect((state) => state.app)(Login);
