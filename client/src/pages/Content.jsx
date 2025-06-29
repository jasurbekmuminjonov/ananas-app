import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { useGetContentsQuery } from "../context/service/content.service";

const Content = () => {
  const { id } = useParams();
  const { data: contents = [] } = useGetContentsQuery();
  const matchContent = contents.find((c) => c._id === id);
  const navigate = useNavigate();

  return (
    <div className="content-container">
      <button onClick={() => navigate(-1)}>
        <FaChevronLeft />
      </button>
      <iframe
        allowFullScreen
        style={{ width: "100%", aspectRatio: 16 / 9, maxWidth: "966px" }}
        src={matchContent?.video_file_link}
        frameborder="0"
      ></iframe>
      <h3 style={{ maxWidth: "966px" }}>{matchContent.content_title}</h3>
      <span style={{ maxWidth: "966px" }}>
        {matchContent.content_description}
      </span>
    </div>
  );
};

export default Content;
