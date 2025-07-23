const Sequencer = require('@jest/test-sequencer').default;
const path = require('path');

class CustomSequencer extends Sequencer {
  sort(tests) {
    const order = [
      'app.e2e-spec.ts',
      'user-flow.e2e-spec.ts',
      'feeder-workflow.e2e-spec.ts',
      'admin-workflow.e2e-spec.ts',
      'admin-user-role.e2e-spec.ts',
    ];
    const rank = (test) => {
      const file = path.basename(test.path);
      const idx = order.indexOf(file);
      return idx === -1 ? order.length : idx;
    };
    return Array.from(tests).sort((a, b) => rank(a) - rank(b));
  }
}

module.exports = CustomSequencer;
