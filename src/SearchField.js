import {useState} from 'react';

export default function SearchField({setSearch}) {
  const [text, setText] = useState('');
  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder="Search"
        value={text}
        onChange={(e) => {
          const newText = e.target.value;
          setText(newText);
          setSearch(newText);
        }}
      />
    </form>
  );
}