import { useState } from 'react';
import NavBar from './components/NavBar';
import axios from 'axios';

const App = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(global.user ? true : false);

  const handleChange = ({ target }) => {
    const { value, name } = target;

    if (name === 'email') {
      setLoginInfo((prevValue) => {
        return {
          email: value,
          password: prevValue.password,
        };
      });
    } else if (name === 'password') {
      setLoginInfo((prevValue) => {
        return {
          email: prevValue.email,
          password: value,
        };
      });
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    axios({
      method: 'POST',
      url: 'http://localhost:8080/login',
      data: loginInfo,
    })
      .then((res) => {
        console.log(res.data);
        document.cookie = `token=${res.data.token}`;
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data);
      });
  };

  console.log(document.cookie);

  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome You're logged in.</h1>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <br />
          <label>Email: </label>
          <br />
          <input
            type={'text'}
            placeholder={'email'}
            value={loginInfo.email}
            onChange={handleChange}
            name="email"
          />
          <br />
          <label>Password: </label>
          <br />
          <input
            type={'password'}
            placeholder={'password'}
            value={loginInfo.password}
            onChange={handleChange}
            name="password"
          />
          <br />
          <button>Login</button>
        </form>
      )}
    </div>
  );
};

export default App;
