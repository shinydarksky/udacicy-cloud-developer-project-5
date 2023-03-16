import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import About from '../views/About'

interface LogInProps {
  auth: Auth
}

interface LogInState { }

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Please log in</h1>
        Welcome to the TODO: Add list applocation
        <div className="login-wrapper">
          <Button  primary onClick={this.onLogin} size="huge" color="olive">
            Log in
          </Button>
        </div>
        <About/>
      </div>
    )
  }
}
