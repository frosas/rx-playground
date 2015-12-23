/*
 *      initialState
 *          |
 *          v
 *   +--> state --> view
 *   |      |
 *   +------+--<-- updates
 */
 
'use strict';

const Rx = require('rx');
const Immutable = require('immutable');

class State {
    constructor(initialState) {
        this._state$ = new Rx.BehaviorSubject(initialState);
        this._updates$ = new Rx.Subject;
        this._updates$.
            withLatestFrom(this._state$, (update, state) => update(state)).
            subscribe(this._state$);
    }
    
    update(update) {
        this._updates$.onNext(update);
    }
    
    get observable() {
        return this._state$.asObservable();
    }
}

const state = new State(Immutable.Map({result: 0}));

// View
state.observable.subscribe(state => console.log('>', state.get('result')));

const plus = amount => {
    return state => state.update('result', result => {
        return result + amount;
    });
};

state.update(plus(1));
state.update(plus(2));
state.update(plus(3));
