import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16'

import App from './App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 *Factory function to create a ShallowWrapper for the App component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Inital state for setup
 * @returns {ShallowWrapper}
*/
const setup = (props={}, state=null) => {
  const wrapper = shallow(<App {...props}/>)
  if (state) wrapper.setState(state)
  return wrapper;
}

/**
* Return ShallowWrapper containing node(s) with the  given data-test value.
* @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within
* @param {string} val - Value od data-test attribute for search
* @returns {ShallowWrapper}
*/

const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
}

test('renders without error', () => {
  const wrapper = setup();
  const appComponent = findByTestAttr(wrapper, 'component-app')
  expect(appComponent.length).toBe(1);
});
test('renders increment button', () => {
  const wrapper = setup();
  const button = findByTestAttr(wrapper, 'increment-button')
  expect(button.length).toBe(1);
});
test('renders counter display', () => {
  const wrapper = setup();
  const counterDisplay = findByTestAttr(wrapper, 'counter-display')
  expect(counterDisplay.length).toBe(1);
});
test('counter starts at 0', () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state('counter');
  expect(initialCounterState).toBe(0);
});
test('clicking button increments counter display', () => {
  const counter = 7
  const wrapper = setup(null, { counter });

  // find button and click
  const button = findByTestAttr(wrapper, 'increment-button');
  button.simulate('click');

  //find display and test value
  const counterDisplay = findByTestAttr(wrapper, 'counter-display');
  expect(counterDisplay.text()).toContain(counter + 1)
});
test('renders the decrement button', () => {
  const wrapper = setup()
  const decButton = findByTestAttr(wrapper, 'decrement-button')
  expect(decButton.length).toBe(1);
})
test('clicking the decrement button decrements the counter display', () => {
  const counter = 8
  const wrapper = setup(null, {counter});

  //find decrement button and click
  const decButton = findByTestAttr(wrapper, 'decrement-button')
  decButton.simulate('click')

  //find display and test value for decrements
  const displayCounter = findByTestAttr(wrapper, 'counter-display')
  expect(displayCounter.text()).toContain(counter - 1);
})
test('error does not show when not needed', () => {
  const wrapper = setup();
  const errorDiv = findByTestAttr(wrapper, 'error-message');

  const errorHasHiddenClass = errorDiv.hasClass('hidden');
  expect(errorHasHiddenClass).toBe(true);
})
describe('counter is zero and decrement button is clicked', () => {
  let wrapper
  beforeEach(() => {
    wrapper = setup()

    const decButton = findByTestAttr(wrapper, 'decrement-button')
    decButton.simulate('click');
    wrapper.update()
  });
  test('error shows', () => {
    const errorDiv = findByTestAttr(wrapper, 'error-message');
    const errorHasHiddenClass = errorDiv.hasClass('hidden');
    expect(errorHasHiddenClass).toBe(false);
  });
  test('counter still displays 0', () => {
    const displayCounter = findByTestAttr(wrapper, 'counter-display')
    expect(displayCounter.text()).toContain(0);
  });
  test('clicking increment clears the error', () => {
    const button = findByTestAttr(wrapper, 'increment-button')
    button.simulate('click');

    const errorDiv = findByTestAttr(wrapper, 'error-message');
    const errorHasHiddenClass = errorDiv.hasClass('hidden');
    expect(errorHasHiddenClass).toBe(true);
  })
})
