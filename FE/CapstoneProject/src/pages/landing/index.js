import * as React from "react";
import Footer from "../../layout/footer/index.js";
import loginSlice from "../../redux/reducers/loginSlice.js";
import { useDispatch } from "react-redux";
import CategoryCard from "../../component/categories/CattegoryCard.js"
import WavyBackground from "../../component/wavy-background/wavy-background.js"
import BentoGridDemo from "../../component/BentoGridDemo/index.js";
function LandingPageComponent() {
    const dispatch = useDispatch();
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const lastName = params.get("lastName");
        const email = params.get("email");
        const avatar = params.get("avatar");
        if (token) {
            dispatch(
                loginSlice.actions.setLogin({
                    token,
                    user: {
                        lastName,
                        email,
                        avatar,
                        firstName: "",
                    },
                })
            );
        }
    }, []);
    return (
        <div className="flex flex-col items-center pt-5 bg-neutral-100 mt-24">
            <main className="w-full">
                <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-xl">
                    {/* <SlideShow /> */}
                    <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                    {/* <div className="lg:w-1/2 lg:pr-12">
                    <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
                    <p className="text-xl">
                        Skills for your present and your future. Get Started with US
                    </p>
                    </div>
                    <div className="lg:w-full mb-8 lg:mb-0">
                    <img
                        src={banner}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                    </div> */}
                       <WavyBackground className="h-44 text-white" colors={["#ff0000", "#00ff00", "#0000ff"]}>
                       <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
                    <p className="text-xl">
                        Skills for your present and your future. Get Started with US
                    </p>
                    </WavyBackground>
                </section>
                </div>
                {/* <CourseSection /> */}
                <div className='flex flex-col gap-4 pt-16 items-center justify-center bg-zinc-100'>                        

                        <CategoryCard/>
                    
                        </div>
                <hr />
                {/* <div className="flex items-center justify-center">
                    <CourseCard />
                </div> */}
                    <BentoGridDemo />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPageComponent;
