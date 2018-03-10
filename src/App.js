import React, { Component } from 'react';
import './App.css';
import { Table } from 'reactstrap';

const list = [ {
  title: 'React',
  url: 'https://facebook.github.io/react/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
}, {
  title: 'Redux',
  url: 'https://github.com/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
}, ];

function isSearched(searchTerm) {
  return function (item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      list,
      searchTerm: ''
    };
    
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  
  onDismiss(id) {
    const updatedList = this.state.list.filter((item) => item.objectID !== id);
    
    this.setState({ list: updatedList });
  }
  
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }
  render() {
    const { searchTerm, list } = this.state;
    
    return (
      <div className="App">
        <div className='main-container'>
          <div className="search-container">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
            >
              Search
            </Search>
          </div>
          <div className="news-table-container">
            <NewsTable
              list={list}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          </div>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input
      type='text'
      value={value}
      onChange={onChange}
    />
  </form>;

const NewsTable = ({ list, pattern, onDismiss }) =>
  <Table striped>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th># of Comments</th>
        <th>Points</th>
        <th>Dismiss</th>
      </tr>
    </thead>
    <tbody>
    {list.filter(isSearched(pattern)).map((item) =>
      <tr key={item.objectID}>
        <td>
          <a href={item.url}>{item.title}</a>
        </td>
        <td>{item.author}</td>
        <td>{item.num_comments}</td>
        <td>{item.points}</td>
        <td>
          <CustomButton
            onClick={() => onDismiss(item.objectID)}
          >
            Dismiss
          </CustomButton>
        </td>
      </tr>
    )}
    </tbody>
  </Table>;


const CustomButton = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type='button'
  >
    {children}
  </button>;

export default App;
