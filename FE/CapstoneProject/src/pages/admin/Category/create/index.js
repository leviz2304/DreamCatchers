import styles from "../../Course/create/CreateCourse.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as dataApi from "../../../../api/apiService/dataService";
import { Navigate, redirect, useParams } from "react-router-dom";

function CreateCategory() {
    const [category, setCateogry] = useState();
    const handleInputChange = (e) => {
        setCateogry(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.promise(dataApi.createCategory(category), {
            loading: "Loading...",
            success: (data) => {
                setCateogry("");
                return data.mess;
            },
            error: (error) => {
                return error.mess;
            },
        });
    };

    return (
        <div>
            <div className="container flex flex-col">
                <div className="wrapMainDash mr-auto w-3/4 ">
                    <h3 className="titleMainDash">Create a new category</h3>
                    <div
                        className={clsx(
                            styles.formGroup,
                            "flex gap-6 flex-col rounded-lg"
                        )}
                    >
                        <div className={clsx(styles.formField)}>
                            <input
                                required
                                onChange={handleInputChange}
                                value={category}
                                name="name"
                                data-validate
                                className={clsx(styles.formInput)}
                                type="text"
                            />
                            <label className={clsx(styles.formLabel)}>
                                Name
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                            onClick={handleSubmit}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;
