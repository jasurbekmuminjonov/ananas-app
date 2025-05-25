import React from 'react';
import { useGetOtherUsersQuery, useGetSelfUserQuery } from '../context/service/user.service';
import { Card, Divider } from 'antd';
import coinImg from '../assets/coin.svg'

const Home = () => {
    const { data: users = [] } = useGetOtherUsersQuery()
    const { data: self = {} } = useGetSelfUserQuery()
    return (
        <div className='home'>
            <Card>
                <div className="profile_picture">
                    <img src={self?.user_photo} alt="" />
                </div>
                <div className='user_info'>
                    <b>@{self?.user_nickname}</b>
                    <p>{self?.user_email}</p>
                    <div className='user_stats'>
                        <b>{self?.balance} <img style={{ width: "15px" }} src={coinImg} alt="" /></b>
                        <b>{self?.followers?.length} <p>obunachilar</p></b>
                        <b>{self?.followings?.length} <p>obunalar</p></b>
                    </div>
                </div>
            </Card>
            <Divider />
            <p>Boshqa foydalanuvchilar</p>
            {
                users?.map((self) => (
                    <Card>
                        <div className="profile_picture">
                            <img src={self?.user_photo} alt="" />
                        </div>
                        <div className='user_info'>
                            <b>@{self?.user_nickname}</b>
                            <p>{self?.user_email}</p>
                            <div className='user_stats'>
                                <b>{self?.balance} <img style={{ width: "15px" }} src={coinImg} alt="" /></b>
                                <b>{self?.followers?.length} <p>obunachilar</p></b>
                                <b>{self?.followings?.length} <p>obunalar</p></b>
                            </div>
                        </div>
                    </Card>
                ))
            }
        </div>
    );
};


export default Home;