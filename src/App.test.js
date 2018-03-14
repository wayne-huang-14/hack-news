import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { Search, NewsTable } from './App';

describe('App', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  
});

describe('Search', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  
});

describe('NewsTable', () => {
  
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ]
  };
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NewsTable {...props} />, div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <NewsTable {...props} />
    );
    
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
