# darts

This is an experiment with using [zustand](https://zustand-demo.pmnd.rs/) and [parcel](https://parceljs.org/) for app development. It's also meant to be a platform independent way to track dart games on whatever device you have handy.

See: https://pausebreak.github.io/darts/ for a live demonstration.

![Cricket Interface](src/images/cricket.png "Cricket Interface")

# Current Progress

- heavily using `zustand` subscribers
- sounds are in place including saying the next player's name if the browser supports `speechSynthesis`
- game logic has 100% test coverage

# Things Need Done

in somewhat of an order:

- react tests ( held off on these until the interface settled )
- stats
- add technical cricket variant
- color pallette
- visual design

# Design Criteria

The interface should maximize click/finger target areas for small screens.

Contextually relevant UI elements should be legible from a short distance. For instance the current player needs to be able to stand at the throwing line and see their score on the phone from ~1 meter away.

Avoid having the interface move or jump during a game.

# Evaluation

If you are going to use hooks then zustand + immer is wonderful to work with.

Parcel has for the most part just worked as advertized. So far the project has not thrown anything hard at it though. For instance the css is just plain css.
