import React, { Component } from 'react';
import './App.css';
import { Table, Button, Form, Input, FormGroup } from 'reactstrap';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '50';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
  
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }
  
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  
  setSearchTopStories(result) {
    const { hits, page } = result;
    
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    
    this.setState({
      result: {
        hits: updatedHits,
        page
      }
    });
  }
  
  onDismiss(id) {
    const updatedList = this.state.result.hits.filter((item) => item.objectID !== id);
    this.setState({ result: {...this.state.result, hits: updatedList} });
  }
  
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }
  
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  
  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    
    return (
      <div className="App">
        <div className='main-container'>
          <div className="search-container container">
            <div className="row justify-content-md-center">
              <div className="col-4">
                <Search
                  value={searchTerm}
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}
                >
                  Search
                </Search>
              </div>
            </div>
          </div>
          {result &&
            <div className="news-table-container">
              <NewsTable
                list={result.hits}
                onDismiss={this.onDismiss}
              />
            </div>
          }
          <div className="pagination-container">
            <Button
              onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
            >
              More
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <Form inline onSubmit={onSubmit}>
    <FormGroup className='mr-3'>
      <Input
        type='text'
        id="inputNewsSearch"
        value={value}
        onChange={onChange}
      />
    </FormGroup>
    <Button type='submit'>{children}</Button>
  </Form>;

const NewsTable = ({ list, onDismiss }) =>
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
    {list.map((item) =>
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
