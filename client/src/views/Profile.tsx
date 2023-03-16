import { useEffect,useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export default function Profile({ auth }: any) {
    const [profile,setProfile] = useState<any>({})
    useEffect(() => {
        const token = auth.accessToken
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://dev-tkib8gnatghhblhe.us.auth0.com/userinfo", requestOptions)
            .then(response => response.json())
            .then(result => setProfile(result))
            .catch(error => console.log('error', error));
    }, [])

    console.log(profile);
    
    return (
        <Card>
            <img src={profile.picture} loading="lazy" referrerpolicy="no-referrer"/>
            <Card.Content>
                <Card.Header>{profile.name} <small>({profile.nickname})</small></Card.Header>
                <Card.Meta>
                    <span className='date'>{profile.email}</span>
                </Card.Meta>
                <Card.Description>
                    Matthew is a musician living in Nashville.
                </Card.Description>
            </Card.Content>
        </Card>
    )
}