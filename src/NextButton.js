export default function NextButton({ dispatch, answer, index, numQuestions  }) {
    if(answer === null) return null;
    if(index < numQuestions - 1) return (
    <button className="btn btn-ui" 
    onClick={() => dispatch({type:"nextQuestion"})}>
        Nästa fråga</button>
    );
    if(index === numQuestions - 1) return (
        <button className="btn btn-ui" 
        onClick={() => dispatch({type:"finish"})}>
            Avsluta quiz</button>
        );
}