import React from 'react'

import Clock from 'react-live-clock';

class Command {
  static clock(format) {
     return <Clock format={format || 'HH:mm:ss'} ticking={true} timezone={'US/Eastern'} />
  }
}

export default Command;
