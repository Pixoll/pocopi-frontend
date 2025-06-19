import { Group } from "@pocopi/config";
import { useEffect } from "react";
import styles from "@/styles/TestInformationPage/TestInformationPage.module.css";

//crear pagina con boton de siguiente
type TestInformationPageProps = {
    onNext: () => void;
    group: Group;
    };



export function TestInformationPage({ onNext, group }: TestInformationPageProps) {
   useEffect(() => {
   console.log(group.text);
    if (!group.text) {
        onNext();
    }
   }, []);

    return (
        <div className={styles["test-information-page"]}>
            <h1>Test Information</h1>
            <p>{group.text}</p>
            <button onClick={onNext}>Next</button>
        </div>
    );

}

