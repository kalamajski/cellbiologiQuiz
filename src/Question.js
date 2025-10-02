import Options from "./Options";

export default function Question({question, dispatch, answer}) {
    return (
        <>
        <h3>{question.question}</h3>
        <Options question={question} dispatch={dispatch} answer={answer} />
        </>
    )
}