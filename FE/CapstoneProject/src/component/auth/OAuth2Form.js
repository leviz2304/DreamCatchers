import Button from "./Button";
import FaceBookLogo from "../../assets/images/facebook-svgrepo-com.svg";
import GithubLogo from "../../assets/images/github-svgrepo-com.svg";
import GoogleLogo from "../../assets/images/google-color-svgrepo-com.svg";
function OAuth2Form() {
    return (
        <div className="flex flex-row items-center justify-center gap-4">
        <Button
            link="http://localhost:8080/oauth2/authorization/google"
            heroiconsOutlinedevicePho={GoogleLogo}
        />
        <Button
            link="http://localhost:8080/oauth2/authorization/facebook"
            heroiconsOutlinedevicePho={FaceBookLogo}
        />
        <Button
            link="http://localhost:8080/oauth2/authorization/github"
            heroiconsOutlinedevicePho={GithubLogo}
        />
    </div>
    
    );
}

export default OAuth2Form;
