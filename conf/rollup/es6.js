import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import base from './base'


export default Object.assign(base, {
  plugins: [
    terser(),
    nodeResolve(),
  ],
  output: [
    Object.assign(base.output, {
      file: 'dist/bundles/queued-observable.es6.min.js',
    }),
    {
      file: 'dist/bundles/queued-observable.es.min.js',
      format: 'es'
    }
  ]
})
