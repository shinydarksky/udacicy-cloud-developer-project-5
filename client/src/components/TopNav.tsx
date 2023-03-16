import { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react'

export default class TopNav extends Component<any, any> {
    state = { activeItem: 'Home' }

    handleItemClick = (e:any, { name }:any) => this.setState({ activeItem: name })


    goHome = () => {
        this.props.history.replace('/');
    }

    goProfile = () => {
        this.props.history.replace('/profile');
    }

    onLogout = () => {
        this.props.onLogout()
    }

    goAbout = () => {
        this.props.history.replace('/about');
    }

    render() {
        const { activeItem } = this.state

        const isLoggedIn = localStorage.getItem("isLoggedIn")

        return (
            <Menu secondary>
                <Menu.Item
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={(e, { name }) => {
                        this.handleItemClick(e, { name })
                        this.goHome()
                    }}
                />
                {isLoggedIn &&
                    <Menu.Item
                        name='Profile'
                        active={activeItem === 'Profile'}
                        onClick={(e, { name }) => {
                            this.handleItemClick(e, { name })
                            this.goProfile()
                        }}
                    />
                }

                {isLoggedIn &&
                    <>
                        <Menu.Item
                            name='about'
                            active={activeItem === 'about'}
                            onClick={(e, { name }) => {
                                this.handleItemClick(e, { name })
                                this.goAbout()
                            }}
                        />
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Input icon='search' placeholder='Search...' onChange={(e, { value }) => {
                                    this.props.history.replace(`/?search=${value}`)
                                }} />
                            </Menu.Item>
                            <Menu.Item
                                name='logout'
                                active={activeItem === 'logout'}
                                onClick={this.onLogout}
                            />
                        </Menu.Menu>
                    </>
                }
            </Menu>
        )
    }
}