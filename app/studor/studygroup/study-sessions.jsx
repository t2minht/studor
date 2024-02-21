import JoinSessionButton from './join-session-button';

export default async function StudySessions(data) {
    if (data.study_sessions === null) {
        return (
            <div>
                <p>Nothing to see here</p>
            </div>
        );
    }


    return (
        <div>
            <pre>{JSON.stringify(data.study_sessions, null, 2)}</pre>

            {data.study_sessions.map((session) => (
                <div key={session.topic}>
                    <h1>{session.topic}</h1>
                    <p>{session.department + ' ' + session.course_number + (session.section ? ' - ' + session.section : '')}</p>
                    <p>{session.location}</p>
                    <p>{session.date}</p>
                    <JoinSessionButton session_id={session.id} />
                </div>
            ))}
        </div>
    );
}
