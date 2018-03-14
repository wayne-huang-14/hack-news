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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    };
  
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    // A non-fluctuating state is used to cache the search term being used
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  /**
   * Checks if the searchTerm is not already in the cached results state
   *
   * @param searchTerm
   *
   * @returns {boolean}
   */
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
  }
  
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }
  
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page} = results[searchKey];
    
    const updatedHits = hits.filter((item) => item.objectID !== id);
    
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }
  
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    })
  }
  
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    
    // Only do a GET request if the searchTerm is not in the cached list
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    
    event.preventDefault();
  }
  
  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (
      results && results[searchKey] && results[searchKey].hits
    ) || [];
    
    if (error) {
      return <p>Something went wrong.</p>;
    }
    
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
          <div className="news-table-container">
            <NewsTable
              list={list}
              onDismiss={this.onDismiss}
            />
          </div>
          <div className="pagination-container">
            <Button
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
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
      <tr key={item.objectID} className='data-row'>
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

export {
  Search,
  NewsTable
};
