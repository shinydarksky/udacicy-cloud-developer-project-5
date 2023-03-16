import { useEffect, useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export default function Profile({ auth }: any) {
    const [profile, setProfile] = useState<any>(null)
    useEffect(() => {
        const token = auth.accessToken
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions:any = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://dev-tkib8gnatghhblhe.us.auth0.com/userinfo", requestOptions)
            .then(response => response.json())
            .then(result => setProfile(result))
            .catch(error => console.log('error', error));
    }, [])

    return (
        <div className="profile-wrapper">
            {profile &&
                <Card>
                    <img src={profile.picture} loading="lazy" referrerPolicy="no-referrer" />
                    <Card.Content>
                        <Card.Header>{profile.name} <small>({profile.nickname})</small></Card.Header>
                        <Card.Meta>
                            <span className='date'>{profile.email}</span>
                        </Card.Meta>
                    </Card.Content>
                </Card>
            }
        </div>
    )
}