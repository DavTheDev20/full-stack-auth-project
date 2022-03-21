import { useState } from 'react';
import NavBar from './components/NavBar';
import axios from 'axios';
import cookie from 'cookie';

const App = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(global.user ? true : false);
  const [userData, setUserData] = useState();

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
        document.cookie = `token=${
          res.data.token
        }; expires=${new Date().setHours(new Date().getHours() + 1)}`;
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data);
      });
  };

  const getData = async (token) => {
    try {
      const res = await axios.get('http://localhost:8080/user', {
        headers: { 'x-access-token': token },
      });
      const data = await res.data;
      setUserData(data.user);
    } catch (err) {
      console.log(err.response);
    }
  };

  const cookies = cookie.parse(document.cookie);
  // console.log(cookies.token);

  return (
    <div>
      {isLoggedIn || cookies.token ? (
        <>
          <h1>Welcome You're logged in.</h1>
          <button onClick={() => getData(cookies.token)}>Get Data</button>
          <br />
          {userData ? (
            <>
              <small>
                Created On: {new Date(userData.createdAt).toLocaleDateString()}
              </small>
              <br />
              <small>Email: {userData.email}</small>
              <br />
              <small>User Id: {userData._id}</small>
            </>
          ) : null}
          <br />
          <button
            onClick={() => {
              document.cookie = 'token=; Max-Age=0';
              document.location.reload();
            }}
          >
            Logout
          </button>
        </>
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
