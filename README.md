# darts

This is an experiment with using [zustand](https://zustand-demo.pmnd.rs/) and [parcel](https://parceljs.org/) for app development. It's also meant to be a platform independent way to track dart games on whatever device you have handy.

See: https://pausebreak.github.io/darts/ for a live demonstration.

![Cricket Interface](src/images/cricket.png "Cricket Interface")

# Current Progress

Cricket game logic is complete minus the cut throat variant.

- heavily using `zustand` subscribers
- sounds are in place including saying the next player's name if the browser supports `speechSynthesis`
- game logic is 100% covered

# Things Need Done

- color pallette
- visual design
- stats
