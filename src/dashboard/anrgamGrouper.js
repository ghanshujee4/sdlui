import {useState} from 'react'




const Anargram = () => {
const [input, setInput] = useState("eat", "tea", "tan", "ate", "nat", "bat");
function findAnram(words) {
  const map = {};
  words.forEach(word => {
    const key = word.split("").sort().join("");
    map[key] = map[key] ? [...map[key], word] : [word];
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(word);
  });
  return Object.values(map);
}
const [result, setResult] = useState([]);
const handleGroup = () => {
  const words = input.split(",").map(w => w.trim());
  setResult(findAnram(words));
}
return (

<div style={{padding: "20px"}}>
  Anargon GROPUP

  <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  />

<button onClick={handleGroup}>Handle Group</button>
<span> Output </span>

{result.map((group, index) => (
  <div key ={index}>
    {JSON.stringify(group)}
    </div>
))}
  </div>


)
}