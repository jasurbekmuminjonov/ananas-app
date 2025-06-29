import { useGetSelfUserQuery } from "../context/service/user.service";
import coinImg from "../assets/coin.svg";
import { useNavigate } from "react-router-dom";

import { LuLogOut } from "react-icons/lu";
import { useGetContentsQuery } from "../context/service/content.service";

const Home = () => {
  const { data: contents = [] } = useGetContentsQuery();
  const { data: self = {} } = useGetSelfUserQuery();
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="user">
        <div className="user_data">
          <div className="profile_picture">
            <img src={self?.user_photo} alt="" />
          </div>
          <div className="user_info">
            <p>{self?.user_nickname}</p>
            {/* <p>{self?.user_email}</p> */}
            {/* <div className="user_stats">
            <b>
            {self?.balance}{" "}
            <img style={{ width: "15px" }} src={coinImg} alt="" />
            </b>
            <b>
            {self?.followers?.length} <p>obunachilar</p>
            </b>
            <b>
            {self?.followings?.length} <p>obunalar</p>
            </b>
            </div> */}
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          <LuLogOut />
        </button>
      </div>
      <div className="content">
        <h2>Barcha kontentlar</h2>
        {contents.map((content) => (
          <div
            className="content-card"
            onClick={() => navigate(`/content/${content._id}`)}
          >
            <div className="content-thumbnail">
              <img src={content.thumbnail_file_link} alt="" />
            </div>
            <div className="content-title">
              <p>{content.content_title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <Card> */}
      {/* </Card> */}
      {/* <Divider /> */}
      {/* <p>Boshqa foydalanuvchilar</p>
      {users?.map((self) => (
        <Card>
          <div className="profile_picture">
            <img src={self?.user_photo} alt="" />
          </div>
          <div className="user_info">
            <b>@{self?.user_nickname}</b>
            <p>{self?.user_email}</p>
            <div className="user_stats">
              <b>
                {self?.balance}{" "}
                <img style={{ width: "15px" }} src={coinImg} alt="" />
              </b>
              <b>
                {self?.followers?.length} <p>obunachilar</p>
              </b>
              <b>
                {self?.followings?.length} <p>obunalar</p>
              </b>
            </div>
          </div>
        </Card>
      ))} */}
    </div>
  );
};

export default Home;
