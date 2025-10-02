export default function Progress({ index, numQuestions, points, maxPossiblePoints, answer }) {
    return (
        <header className="progress">
            <progress max={numQuestions} value={index + Number(answer !== null)} />
            <p>Fråga <strong>{index + 1}</strong></p>
            <p><strong>{points}</strong> / {maxPossiblePoints}</p>
        </header>
    );
}