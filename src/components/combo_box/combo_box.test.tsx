/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { ReactNode } from 'react';
import { shallow, mount } from 'enzyme';
import { render } from '../../test/rtl';
import {
  requiredProps,
  findTestSubject,
  takeMountedSnapshot,
} from '../../test';
import { comboBoxKeys } from '../../services';

import { EuiComboBox, EuiComboBoxProps } from './combo_box';
import type { EuiComboBoxOptionOption } from './types';

jest.mock('../portal', () => ({
  EuiPortal: ({ children }: { children: ReactNode }) => children,
}));

interface TitanOption {
  'data-test-subj'?: 'titanOption';
  label: string;
}
const options: TitanOption[] = [
  {
    'data-test-subj': 'titanOption',
    label: 'Titan',
  },
  {
    label: 'Enceladus',
  },
  {
    label: 'Mimas',
  },
  {
    label: 'Dione',
  },
  {
    label: 'Iapetus',
  },
  {
    label: 'Phoebe',
  },
  {
    label: 'Rhea',
  },
  {
    label:
      "Pandora is one of Saturn's moons, named for a Titaness of Greek mythology",
  },
  {
    label: 'Tethys',
  },
  {
    label: 'Hyperion',
  },
];

describe('EuiComboBox', () => {
  test('is rendered', () => {
    const { container } = render(<EuiComboBox {...requiredProps} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('supports thousands of options in an options group', () => {
    // tests for a regression: RangeError: Maximum call stack size exceeded
    // https://mathiasbynens.be/demo/javascript-argument-count
    const options: EuiComboBoxOptionOption[] = [{ label: 'test', options: [] }];
    for (let i = 0; i < 250000; i++) {
      options[0].options?.push({ label: `option ${i}` });
    }

    mount(<EuiComboBox {...requiredProps} options={options} />);
  });
});

describe('props', () => {
  test('options list is rendered', () => {
    const component = mount(
      <EuiComboBox
        options={options}
        data-test-subj="alsoGetsAppliedToOptionsList"
      />
    );

    component.setState({ isListOpen: true });
    expect(takeMountedSnapshot(component)).toMatchSnapshot();
  });

  test('selectedOptions are rendered', () => {
    const component = shallow(
      <EuiComboBox
        options={options}
        selectedOptions={[options[2], options[4]]}
      />
    );

    expect(component).toMatchSnapshot();
  });

  test('custom ID is rendered', () => {
    const component = shallow(
      <EuiComboBox
        id="test-id-1"
        options={options}
        selectedOptions={[options[2], options[4]]}
      />
    );

    expect(component).toMatchSnapshot();
  });

  describe('option.prepend & option.append', () => {
    const options = [
      { label: '1', prepend: 'Pre' },
      { label: '2', append: 'Post' },
    ];

    test('renders in pills', () => {
      const component = render(
        <EuiComboBox options={options} selectedOptions={options} />
      );

      expect(component.find('.euiComboBoxPill__prepend')).toHaveLength(1);
      expect(component.find('.euiComboBoxPill__append')).toHaveLength(1);
      expect(component.find('.euiComboBoxPill')).toMatchSnapshot();
    });

    test('renders in the options dropdown', () => {
      const component = mount(<EuiComboBox options={options} />);
      component.setState({ isListOpen: true });

      const dropdown = component.find(
        'div[data-test-subj="comboBoxOptionsList"]'
      );
      expect(dropdown.find('.euiComboBoxOption__prepend')).toHaveLength(1);
      expect(dropdown.find('.euiComboBoxOption__append')).toHaveLength(1);
      expect(dropdown.render()).toMatchSnapshot();
    });

    test('renders in single selection', () => {
      const component = render(
        <EuiComboBox
          options={options}
          selectedOptions={[options[0]]}
          singleSelection={{ asPlainText: true }}
        />
      );
      expect(component.find('.euiComboBoxPill')).toMatchSnapshot();
    });
  });

  describe('isClearable=false disallows user from clearing input', () => {
    test('when no options are selected', () => {
      const component = shallow(
        <EuiComboBox options={options} isClearable={false} />
      );

      expect(component).toMatchSnapshot();
    });

    test('when options are selected', () => {
      const component = shallow(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2], options[4]]}
          isClearable={false}
        />
      );

      expect(component).toMatchSnapshot();
    });
  });

  describe('singleSelection', () => {
    test('is rendered', () => {
      const component = shallow(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          singleSelection={true}
        />
      );

      expect(component).toMatchSnapshot();
    });
    test('selects existing option when opened', () => {
      const component = shallow(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          singleSelection={true}
        />
      );

      component.setState({ isListOpen: true });
      expect(component).toMatchSnapshot();
    });
    test('prepend and append is rendered', () => {
      const component = shallow(
        <EuiComboBox
          options={options}
          singleSelection={true}
          prepend="String"
          append="String"
        />
      );

      component.setState({ isListOpen: true });
      expect(component).toMatchSnapshot();
    });
  });

  test('isDisabled is rendered', () => {
    const component = shallow(
      <EuiComboBox
        options={options}
        selectedOptions={[options[2]]}
        isDisabled={true}
      />
    );

    expect(component).toMatchSnapshot();
  });

  test('full width is rendered', () => {
    const component = shallow(
      <EuiComboBox
        options={options}
        selectedOptions={[options[2]]}
        fullWidth={true}
      />
    );

    expect(component).toMatchSnapshot();
  });

  test('delimiter is rendered', () => {
    const component = shallow(
      <EuiComboBox
        options={options}
        selectedOptions={[options[2], options[3]]}
        delimiter=","
      />
    );

    expect(component).toMatchSnapshot();
  });

  test('autoFocus is rendered', () => {
    const component = shallow(
      <EuiComboBox
        options={options}
        selectedOptions={[options[2], options[3]]}
      />
    );

    expect(component).toMatchSnapshot();
  });

  test('aria-label attribute is rendered', () => {
    const component = shallow(
      <EuiComboBox aria-label="Test label" options={options} />
    );

    expect(component).toMatchSnapshot();
  });

  test('aria-labelledby attribute is rendered', () => {
    const component = shallow(
      <EuiComboBox aria-labelledby="test-heading-id" options={options} />
    );

    expect(component).toMatchSnapshot();
  });
});

test('does not show multiple checkmarks with duplicate labels', () => {
  const options = [
    {
      label: 'Titan',
      key: 'titan1',
    },
    {
      label: 'Titan',
      key: 'titan2',
    },
    {
      label: 'Tethys',
    },
  ];
  const component = mount(
    <EuiComboBox
      singleSelection={{ asPlainText: true }}
      options={options}
      selectedOptions={[options[1]]}
    />
  );

  const searchInput = findTestSubject(component, 'comboBoxSearchInput');
  searchInput.simulate('focus');

  expect(component.find('EuiFilterSelectItem[checked="on"]').length).toBe(1);
});

describe('behavior', () => {
  describe('hitting "Enter"', () => {
    test('calls the onCreateOption callback when there is input', () => {
      const onCreateOptionHandler = jest.fn();

      const component = mount(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          onCreateOption={onCreateOptionHandler}
        />
      );

      component.setState({ searchValue: 'foo' });
      const searchInput = findTestSubject(component, 'comboBoxSearchInput');
      searchInput.simulate('focus');
      searchInput.simulate('keyDown', { key: comboBoxKeys.ENTER });
      expect(onCreateOptionHandler).toHaveBeenCalledTimes(1);
      expect(onCreateOptionHandler).toHaveBeenNthCalledWith(1, 'foo', options);
    });

    test("doesn't the onCreateOption callback when there is no input", () => {
      const onCreateOptionHandler = jest.fn();

      const component = mount(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          onCreateOption={onCreateOptionHandler}
        />
      );

      const searchInput = findTestSubject(component, 'comboBoxSearchInput');
      searchInput.simulate('focus');
      searchInput.simulate('keyDown', { key: comboBoxKeys.ENTER });
      expect(onCreateOptionHandler).not.toHaveBeenCalled();
    });
  });

  describe('tabbing', () => {
    test("off the search input closes the options list if the user isn't navigating the options", () => {
      const onKeyDownWrapper = jest.fn();
      const component = mount(
        <div onKeyDown={onKeyDownWrapper}>
          <EuiComboBox options={options} selectedOptions={[options[2]]} />
        </div>
      );

      const searchInput = findTestSubject(component, 'comboBoxSearchInput');
      searchInput.simulate('focus');

      // Focusing the input should open the options list.
      expect(findTestSubject(component, 'comboBoxOptionsList')).toBeDefined();

      // Tab backwards to take focus off the combo box.
      searchInput.simulate('keyDown', {
        key: comboBoxKeys.TAB,
        shiftKey: true,
      });

      // If the TAB keydown propagated to the wrapper, then a browser DOM would shift the focus
      expect(onKeyDownWrapper).toHaveBeenCalledTimes(1);
    });

    test('off the search input calls onCreateOption', () => {
      const onCreateOptionHandler = jest.fn();

      const component = mount(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          onCreateOption={onCreateOptionHandler}
        />
      );

      component.setState({ searchValue: 'foo' });
      const searchInput = findTestSubject(component, 'comboBoxSearchInput');
      searchInput.simulate('focus');

      const searchInputNode = searchInput.getDOMNode();
      // React doesn't support `focusout` so we have to manually trigger it
      searchInputNode.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true })
      );

      expect(onCreateOptionHandler).toHaveBeenCalledTimes(1);
      expect(onCreateOptionHandler).toHaveBeenNthCalledWith(1, 'foo', options);
    });

    test('off the search input does nothing if the user is navigating the options', () => {
      const onKeyDownWrapper = jest.fn();
      const component = mount(
        <div onKeyDown={onKeyDownWrapper}>
          <EuiComboBox options={options} selectedOptions={[options[2]]} />
        </div>
      );

      const searchInput = findTestSubject(component, 'comboBoxSearchInput');
      searchInput.simulate('focus');

      // Focusing the input should open the options list.
      expect(findTestSubject(component, 'comboBoxOptionsList')).toBeDefined();

      // Navigate to an option.
      searchInput.simulate('keyDown', { key: comboBoxKeys.ARROW_DOWN });

      // Tab backwards to take focus off the combo box.
      searchInput.simulate('keyDown', {
        key: comboBoxKeys.TAB,
        shiftKey: true,
      });

      // If the TAB keydown did not bubble to the wrapper, then the tab event was prevented
      expect(onKeyDownWrapper.mock.calls.length).toBe(0);
    });
  });

  describe('clear button', () => {
    test('calls onChange callback with empty array', () => {
      const onChangeHandler = jest.fn();
      const component = mount(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          onChange={onChangeHandler}
        />
      );

      findTestSubject(component, 'comboBoxClearButton').simulate('click');
      expect(onChangeHandler).toHaveBeenCalledTimes(1);
      expect(onChangeHandler).toHaveBeenNthCalledWith(1, []);
    });

    test('focuses the input', () => {
      const component = mount(
        <EuiComboBox
          options={options}
          selectedOptions={[options[2]]}
          onChange={() => {}}
        />
      );

      findTestSubject(component, 'comboBoxClearButton').simulate('click');
      expect(
        findTestSubject(component, 'comboBoxSearchInput').getDOMNode()
      ).toBe(document.activeElement);
    });
  });

  describe('sortMatchesBy', () => {
    const sortMatchesByOptions = [
      {
        label: 'Something is Disabled',
      },
      ...options,
    ];
    test('options "none"', () => {
      const component = mount<
        EuiComboBox<TitanOption>,
        EuiComboBoxProps<TitanOption>,
        { matchingOptions: TitanOption[] }
      >(<EuiComboBox options={sortMatchesByOptions} sortMatchesBy="none" />);

      findTestSubject(component, 'comboBoxSearchInput').simulate('change', {
        target: { value: 'di' },
      });

      expect(component.state('matchingOptions')[0].label).toBe(
        'Something is Disabled'
      );
    });

    test('options "startsWith"', () => {
      const component = mount<
        EuiComboBox<TitanOption>,
        EuiComboBoxProps<TitanOption>,
        { matchingOptions: TitanOption[] }
      >(
        <EuiComboBox
          options={sortMatchesByOptions}
          sortMatchesBy="startsWith"
        />
      );

      findTestSubject(component, 'comboBoxSearchInput').simulate('change', {
        target: { value: 'di' },
      });

      expect(component.state('matchingOptions')[0].label).toBe('Dione');
    });
  });

  describe('isCaseSensitive', () => {
    const isCaseSensitiveOptions = [
      {
        label: 'Case sensitivity',
      },
    ];

    test('options "false"', () => {
      const component = mount<
        EuiComboBox<TitanOption>,
        EuiComboBoxProps<TitanOption>,
        { matchingOptions: TitanOption[] }
      >(
        <EuiComboBox options={isCaseSensitiveOptions} isCaseSensitive={false} />
      );

      findTestSubject(component, 'comboBoxSearchInput').simulate('change', {
        target: { value: 'case' },
      });

      expect(component.state('matchingOptions')[0].label).toBe(
        'Case sensitivity'
      );
    });

    test('options "true"', () => {
      const component = mount<
        EuiComboBox<TitanOption>,
        EuiComboBoxProps<TitanOption>,
        { matchingOptions: TitanOption[] }
      >(
        <EuiComboBox options={isCaseSensitiveOptions} isCaseSensitive={true} />
      );

      findTestSubject(component, 'comboBoxSearchInput').simulate('change', {
        target: { value: 'case' },
      });

      expect(component.state('matchingOptions').length).toBe(0);

      findTestSubject(component, 'comboBoxSearchInput').simulate('change', {
        target: { value: 'Case' },
      });

      expect(component.state('matchingOptions')[0].label).toBe(
        'Case sensitivity'
      );
    });
  });

  it('calls the inputRef prop with the input element', () => {
    const inputRefCallback = jest.fn();

    const component = mount<
      EuiComboBox<TitanOption>,
      EuiComboBoxProps<TitanOption>,
      { matchingOptions: TitanOption[] }
    >(<EuiComboBox options={options} inputRef={inputRefCallback} />);

    expect(inputRefCallback).toHaveBeenCalledTimes(1);
    expect(component.find('input[role="combobox"]').getDOMNode()).toBe(
      inputRefCallback.mock.calls[0][0]
    );
  });
});
