import React from 'react';
import { mount } from 'enzyme';
import Game from '../components/Game';
import { PAIRS_NO, PLACEHOLDER_IMG } from '../helpers/constant';

describe('<Game />', () => {
  it('Generated length is double of number of pairs', () => {
    const wrapper = mount(<Game />);
    expect(wrapper.find('.tile')).toHaveLength(PAIRS_NO * 2);
  });
  it('Once user click, Card gets flipped', () => {
    const wrapper = mount(<Game />);
    const cells = wrapper.find('.tile');
    //Nothing is flipped Yet ?
    expect(cells.everyWhere((n) => !n.hasClass('is-flipped'))).toEqual(true);
    //Photo can't be seen in the DOM, so nobody can cheat by knowing what's the photo behind the hidden card
    expect(cells.first().html()).toContain(PLACEHOLDER_IMG);
    //Good, then let's flip one card and see
    cells.first().simulate('click');
    //Yaaay, the card is flipped and have the right CSS class
    expect(wrapper.find('.tile').first().hasClass('is-flipped')).toEqual(true);
    //Now the image is there and the placeholder is gone
    expect(cells.first().html()).not.toContain(PLACEHOLDER_IMG);
  });
});
