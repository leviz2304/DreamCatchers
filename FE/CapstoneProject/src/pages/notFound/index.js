import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import NotFoundImg from "../../assets/images/404.png";
const NotFoundPage = () => {
    return (
        <div className={styles.dashpropsPages404Error}>
            <img
                className={styles.errorImgIcon}
                loading="lazy"
                alt=""
                src={NotFoundImg}
            />
          
                
                
            
        </div>
    );
};

export default NotFoundPage;
