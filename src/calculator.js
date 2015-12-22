'use strict';

const Rx = require('rx');
const Immutable = require('immutable');

const state$ = new Rx.Subject;

const updateState = (() => {
    // TODO Use Rx.ReplaySubject(1) instead?
    let state;
    state$.subscribe(newState => state = newState);
    
    return update => state$.onNext(update(state));
})();

// View
state$.subscribe(state => console.log('>', state.get('result')));

// Initialization
state$.onNext(Immutable.Map({result: 0}));

const plus = amount => {
    return state => state.update('result', result => {
        return result + amount;
    });
};

updateState(plus(1));
updateState(plus(2));
updateState(plus(3));
