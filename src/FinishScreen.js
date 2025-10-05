export default function FinishScreen({dispatch, points, maxPossiblePoints}) {
    const percentage = (points/maxPossiblePoints) * 100;

    return (
        <>
        <p className="result">
            Du fick <strong>{points}</strong> utav max {maxPossiblePoints} poäng! ({Math.ceil(percentage)}%)
        </p>
       
        <button className="btn btn-end" 
        onClick={() => dispatch({type:"backToChapterSelect"})}>
            Välj annat kapitel</button>
        <button className="btn btn-end"
        onClick={() => dispatch({type:"restart"})}>
            Börja om samma kapitel</button>
        </>
    );
}