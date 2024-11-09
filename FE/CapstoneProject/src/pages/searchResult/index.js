import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./searchResult.module.scss";
import { getCourseByName } from "../../api/apiService/dataService";

const SearchResults = () => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCourseByName(query, 0, 10);
                setResults(response.content); // Assuming the API response structure
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        if (query) {
            fetchData();
        }
    }, [query]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{query}</h1>
            </div>
            <div className={styles.results}>
                <h2>Khóa học</h2>
                {results.map((result, index) => (
                    <div key={index} className={styles.resultItem}>
                        <div className={styles.imageWrapper}>
                            <img src={result.thumbnail} alt={result.title} />
                        </div>
                        <div className={styles.contentWrapper}>
                            <h3>
                                <Link to={`/courses/${result.id}`}>
                                    {result.title}
                                </Link>
                            </h3>
                            <p>{result.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
