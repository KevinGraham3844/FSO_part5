import PropTypes from 'prop-types'

const LoginForm = ({
  username,
  password,
  handleLogin,
  setUserFunc,
  setPassFunc
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={setUserFunc}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={setPassFunc}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUserFunc: PropTypes.func.isRequired,
  setPassFunc: PropTypes.func.isRequired
}

export default LoginForm