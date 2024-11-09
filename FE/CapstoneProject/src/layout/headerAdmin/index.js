import NavigationTopBar from "../../component/dashboard/NavigationTopBar";
import styles from "./HeaderAdmin.module.scss";
import logo from "../../assets/images/logo.png";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminHeader() {

    return (
        <div
            className={clsx("z-header d-flex fixed", styles.dashContainer, {
                [styles.dashboard3]: true,
            })}
        >
            <main className={styles.homePage}>
                <section className={styles.contentArea}>
                    <NavigationTopBar />
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
                                <span>Dream</span>
                                <span className={styles.stack}> Chasers</span>
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
                {/* <div className={styles.pageHeader}>
                    <b className={styles.pages}>PAGES</b>
                </div>
                <div className={styles.dividerParent}>
                    <img
                        className={styles.dividerIcon1}
                        alt=""
                        src="/divider.svg"
                    />
                    <div className={styles.settingsNavigation}>
                        <div className={styles.navigationSidebarItemLi}>
                            <div className={styles.products1}>
                                <div className={styles.hideBg} />
                                <h3 className={styles.h3}></h3>
                                <div className={styles.settingsName}>
                                    <div className={styles.products2}>
                                        Settings
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.navigationSidebarItemLi1}>
                            <div className={styles.products3}>
                                <div className={styles.hideBg1} />
                                <h3 className={styles.h31}></h3>
                                <div className={styles.productsContainer}>
                                    <div className={styles.products4}>
                                        Logout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* </div> */}
                {/* <div className={styles.navigationSidebarMenuLi1}>
                <div className={styles.sideBarBg1} />
                <div className={styles.products5}>
                    <div className={styles.hideBg2} />
                    <div className={styles.products6}>Logout</div>
                    <div className={styles.div}></div>
                </div>
                <div className={styles.products7}>
                    <div className={styles.hideBg3} />
                    <div className={styles.products8}>Settings</div>
                    <div className={styles.div1}></div>
                </div>
                <img
                    className={styles.dividerIcon2}
                    alt=""
                    src="/divider-2.svg"
                />
                <div className={styles.products9}>
                    <div className={styles.hideBg4} />
                    <div className={styles.products10}>Table</div>
                    <div className={styles.div2}></div>
                </div>
                <div className={styles.products11}>
                    <div className={styles.hideBg5} />
                    <div className={styles.products12}>Profile</div>
                    <div className={styles.div3}></div>
                </div>
                <div className={styles.products13}>
                    <div className={styles.hideBg6} />
                    <div className={styles.products14}>UI Elements</div>
                    <div className={styles.div4}></div>
                </div>
                <div className={styles.products15}>
                    <div className={styles.hideBg7} />
                    <div className={styles.products16}>Invoice</div>
                    <div className={styles.div5}></div>
                </div>
                <div className={styles.products17}>
                    <div className={styles.hideBg8} />
                    <div className={styles.products18}>Contact</div>
                    <div className={styles.div6}></div>
                </div>
                <div className={styles.products19}>
                    <div className={styles.hideBg9} />
                    <div className={styles.products20}>To-Do</div>
                    <div className={styles.div7}></div>
                </div>
                <div className={styles.products21}>
                    <div className={styles.hideBg10} />
                    <div className={styles.products22}>Feed</div>
                    <div className={styles.div8}></div>
                </div>
                <div className={styles.products23}>
                    <div className={styles.hideBg11} />
                    <div className={styles.products24}>Calendar</div>
                    <div className={styles.div9}></div>
                </div>
                <div className={styles.products25}>
                    <div className={styles.hideBg12} />
                    <div className={styles.products26}>File Manager</div>
                    <div className={styles.div10}></div>
                </div> */}
                {/* <b className={styles.pages1}>PAGES</b>
                <img
                    className={styles.dividerIcon3}
                    alt=""
                    src="/divider-3.svg"
                />
                <div className={styles.products27}>
                    <div className={styles.hideBg13} />
                    <div className={styles.products28}>E-commerce</div>
                    <div className={styles.div11}></div>
                </div>
                <div className={styles.products29}>
                    <div className={styles.hideBg14} />
                    <div className={styles.products30}>Order Lists</div>
                    <div className={styles.div12}></div>
                </div>
                <div className={styles.products31}>
                    <div className={styles.hideBg15} />
                    <div className={styles.products32}>Messenger</div>
                    <div className={styles.div13}></div>
                </div>
                <div className={styles.products33}>
                    <div className={styles.hideBg16} />
                    <div className={styles.products34}>Favourites</div>
                    <div className={styles.div14}></div>
                </div>
                <div className={styles.navigationSidebarItemLi2}>
                    <div className={styles.products35}>
                        <div className={styles.hideBgHideBgCopyMask}>
                            <div className={styles.mask1} />
                            <div className={styles.hideBg17} />
                            <div className={styles.hideBgCopy} />
                        </div>
                        <div className={styles.products36}>Products</div>
                        <div className={styles.div15}></div>
                    </div>
                </div>
                <div className={styles.products37}>
                    <div className={styles.hideBg18} />
                    <div className={styles.products38}>Dashboard</div>
                    <div className={styles.div16}></div>
                </div>
                <div className={styles.logo1}>
                    <div className={styles.bg} />
                    <div className={styles.brightWeb1}>
                        <span>Dash</span>
                        <span className={styles.stack1}>Stack</span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default AdminHeader;
