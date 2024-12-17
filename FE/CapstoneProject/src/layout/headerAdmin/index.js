import styles from "./HeaderAdmin.module.scss";
import logo from "../../assets/images/E-tutor_logo.png";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminHeader() {

    return (
        <div
            className={clsx("z-header d-flex fixed z-[1050]", styles.dashContainer, {
                [styles.dashboard3]: true,
            })}
        >
            <main className={styles.homePage}>
                <section className={styles.contentArea}>
                    {/* <NavigationTopBar /> */}
                </section>
            </main>
            <div
                className={clsx(styles.content, {
                    [styles.navigationSidebarMenuLi]: false,
                })}
            >
                <div className={styles.logoContainer}>
                    <Link to="/">
                        <div className={styles.logo}>
                            <img src={logo} alt="Logo Dream Chasers" />
                            <h3 className={styles.brightWeb}>
                                {/* <span>Dream</span> */}

                                <span className={styles.stack}>Dream Catchers</span>
                            </h3>
                        </div>
                    </Link>
                </div>

                {/* <ProductNavigation /> */}
                <img
                    className={styles.dividerIcon}
                    loading="lazy"
                    alt=""
                    src="/divider.svg"
                />
              
            </div>
        </div>
    );
}

export default AdminHeader;
