const store = {
  state: {
    attack: 2,
    life: 10,
    speed: 300, //値が小さければ小さいほどいい。行動の間隔
    motionRange: 100,
  }
};

// window.addEventListener('resize', () => {
//   store.state.width = window.innerWidth;
//   store.state.height = window.innerHeight;
// });
//
// window.addEventListener('scroll', () => {
//   store.state.scrollX = window.pageXOffset;
//   store.state.scrollY = window.pageYOffset;
// });

export default store;
