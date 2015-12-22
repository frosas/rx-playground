'use strict';

const Rx = require('rx');
const Immutable = require('immutable');

const state$ = new Rx.Subject;

// TODO Use Rx.ReplaySubject(1) instead?
let state;
state$.subscribe(newState => state = newState);

// View
state$.subscribe(state => console.log('>', state.get('result')));

// Initialization
state$.onNext(Immutable.Map({result: 0}));

const updateState = update => {
    state$.onNext(update(state));
};

const plus = amount => {
    return state => state.update('result', result => {
        return result + amount;
    });
};

updateState(plus(1));
updateState(plus(2));
updateState(plus(3));
