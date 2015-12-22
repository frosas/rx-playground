'use strict';

const Rx = require('rx');
const Immutable = require('immutable');

class State {
    constructor() {
        this._state$ = new Rx.Subject;
        
        // TODO Use Rx.ReplaySubject(1) instead?
        this._state$.subscribe(newState => this._state = newState);
    }
    
    update(update) {
        this._state$.onNext(update(this._state));
    }
    
    get observable() {
        return this._state$.asObservable();
    }
}

const state = new State;

// View
state.observable.subscribe(state => console.log('>', state.get('result')));

// Initialization
state.update(() => Immutable.Map({result: 0}));

const plus = amount => {
    return state => state.update('result', result => {
        return result + amount;
    });
};

state.update(plus(1));
state.update(plus(2));
state.update(plus(3));
