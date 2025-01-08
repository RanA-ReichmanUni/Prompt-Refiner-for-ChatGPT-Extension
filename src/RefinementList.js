const RefinementList = ({ refinements, onView, onSelect }) => {
  const refinementArray = Object.values(refinements); // Convert object to array

  return (
    <div>
      <h2>Refinements</h2>
      {refinementArray.map((text, index) => (
        <div key={index} className="refinement">
          <p><strong>Refinement {index + 1}:</strong> {text.slice(0, 50)}...</p>
          <button onClick={() => onView(index)}>View Full Text</button>
          <button onClick={() => onSelect(index)}>Select</button>
        </div>
      ))}
    </div>
  );
};

export default RefinementList;
