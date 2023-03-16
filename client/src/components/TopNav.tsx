import { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react'

export default class TopNav extends Component<any, any> {
    state = { activeItem: 'Home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })


    goHome = () => {
        this.props.history.replace('/');
    }

    goProfile = () =>{
        this.props.history.replace('/profile');
    }

    onLogout = () =>{
        this.props.onLogout()
    }

    render() {
        const { activeItem } = this.state

        return (
            <Menu secondary>
                <Menu.Item
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={(e,{name})=>{
                        this.handleItemClick(e,{name})
                        this.goHome()
                    }}
                />
                <Menu.Item
                    name='User'
                    active={activeItem === 'User'}
                    onClick={(e,{name})=>{
                        this.handleItemClick(e,{name})
                        this.goProfile()
                    }}
                />
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Input icon='search' placeholder='Search...' />
                    </Menu.Item>
                    <Menu.Item
                        name='logout'
                        active={activeItem === 'logout'}
                        onClick={this.onLogout}
                    />
                </Menu.Menu>
            </Menu>
        )
    }
}