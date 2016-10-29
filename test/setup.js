'use strict';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

chai.config.truncateThreshold = 0;

global.expect = expect;
global.sinon = sinon;
