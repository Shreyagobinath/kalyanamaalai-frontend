
import { useMatches } from '../hooks/usematches';

const ViewMatches = () => {
  const { data: matches, isLoading, isError, error } = useMatches();

  if (isLoading) return <div>Searching for your perfect match...</div>;
  if (isError) return <div>Could not load matches: {error.message}</div>;
  
  return (
    <div>
      <h2>Your Top Matches</h2>
      {matches.length === 0 ? (
        <p>No new matches found at this time.</p>
      ) : (
        <div className="match-grid">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <h3>{match.name}</h3>
              <p>{match.age} years old, from {match.city}</p>
              {/*  */}
              <button>View Profile</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};